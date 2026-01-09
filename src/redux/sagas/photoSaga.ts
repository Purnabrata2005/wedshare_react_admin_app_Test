// src/redux/sagas/photoSaga.ts
import { all, call, put, delay, takeEvery, select } from "redux-saga/effects"
import AxiosWedding from "@/redux/service/axiosWedding"
import imageCompression from "browser-image-compression"
import { photoDB, type PendingPhoto } from "@/DB/uploadDB"
import { encryptPhotoIfNeeded } from "@/crypto/photoEncryption"
import type { Wedding } from "@/redux/slices/weddingSlice"



import {
  uploadPhotosRequest,
  uploadPhotosEnqueued,
  uploadPhotosCompleted,
  uploadPhotosFailure,
  updatePhotoProgress,
  updatePhotoStatus,
  addUploadedPhotos,
} from "@/redux/slices/photoSlice"
import type { UploadPhotosPayload, UploadedPhotoResponse } from "@/redux/slices/photoSlice"
import { store } from "@/redux/store" // ensure your store exports this

const RETRY_INTERVAL = 5000
const MAX_RETRIES = 5
const BATCH_SIZE = 10

// Track UUIDs whose metadata has already been registered (to prevent duplicate registration)
const uploadedPhotoIds = new Set<string>()
let hasUploadBeenRequested = false

function uploadToS3(url: string, file: Blob, uuid: string, weddingId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("PUT", url)

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100)
        store.dispatch(updatePhotoProgress({ weddingId, uuid, progress }))
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve()
      } else {
        reject(new Error(`S3 upload failed: ${xhr.status}`))
      }
    }

    xhr.onerror = () => {
      reject(new Error("S3 upload network error"))
    }

    xhr.send(file)
  })
}

// Enqueue files into Dexie when user clicks "Upload to Server"
function* enqueuePhotosSaga(action: {
  type: string
  payload: UploadPhotosPayload
}): Generator<any, void, any> {
  try {
    const { weddingId, photos } = action.payload
    hasUploadBeenRequested = true

    for (const p of photos) {
      // Skip if this photo's metadata was previously registered
      if (uploadedPhotoIds.has(p.uuid)) {
        continue
      }
      // Skip if it's already in Dexie queue (avoid duplicates if user clicks twice quickly)
      const existing: PendingPhoto | undefined = yield call(() => photoDB.queue.get(p.uuid))
      if (existing) {
        continue
      }
      const pending: PendingPhoto = {
        uuid: p.uuid,
        weddingId,
        file: p.file, // REAL FILE, no blob URL
        extension: p.extension,
        originalFilename: p.originalFilename,
        status: "pending",
        progress: 0,
        retries: 0,
        createdAt: Date.now(),
      }

      yield call(() => photoDB.queue.put(pending))
      yield put(updatePhotoStatus({ weddingId, uuid: p.uuid, status: "pending" }))
    }

    yield put(uploadPhotosEnqueued())
  } catch (err: any) {
    console.error("enqueuePhotosSaga error:", err)
    yield put(uploadPhotosFailure(err.message || "Failed to enqueue photos"))
  }
}

//  Rehydrate Redux state from Dexie on startup (for resume)
function* rehydratePhotosSaga(): Generator<any, void, any> {
  const all: PendingPhoto[] = yield call(() => photoDB.queue.toArray())
  for (const item of all) {
    yield put(
      updatePhotoStatus({
        weddingId: item.weddingId,
        uuid: item.uuid,
        status: item.status,
      })
    )
    yield put(
      updatePhotoProgress({
        weddingId: item.weddingId,
        uuid: item.uuid,
        progress: item.progress,
      })
    )
  }
}

//  Background worker: runs forever
function* processUploadQueue(): Generator<any, void, any> {
  // initial rehydrate once
  yield call(rehydratePhotosSaga)

  while (true) {
    if (!navigator.onLine) {
      yield delay(RETRY_INTERVAL)
      continue
    }
    
    // Get all items in queue
    const allItems: PendingPhoto[] = yield call(() => photoDB.queue.toArray())
    
    // Get pending photos (only those not yet uploaded)
    const pending: PendingPhoto[] = yield call(() =>
      photoDB.queue.where("status").equals("pending").sortBy("createdAt")
    )

    // Check if upload was requested and all uploads are complete
    if (hasUploadBeenRequested && pending.length === 0 && allItems.length === 0) {
      yield put(uploadPhotosCompleted())
      hasUploadBeenRequested = false
    }

    if (!pending.length) {
      yield delay(RETRY_INTERVAL)
      continue
    }

    for (let i = 0; i < pending.length; i += BATCH_SIZE) {
      const batch = pending.slice(i, i + BATCH_SIZE)
      yield call(uploadBatchSaga, batch)
    }

    yield delay(RETRY_INTERVAL)
  }
}

//  Upload a batch of up to 10 photos
function* uploadBatchSaga(batch: PendingPhoto[]): Generator<any, void, any> {
  if (!batch.length) return

  const weddingId = batch[0].weddingId

  // Get albumPublicKey and processPublicKey from Redux store
  const weddings: Wedding[] = yield select((state: any) => state.weddings?.weddings || [])
  const processPublicKey: string | null = yield select((state: any) => state.weddings?.processPublicKey || null)
  const currentWedding = weddings.find((w) => w.weddingId === weddingId || w.id === weddingId)
  const albumPublicKey = currentWedding?.albumPublicKey || undefined



  // Filter out any photos whose metadata were somehow already registered (defensive)
  const effectiveBatch = batch.filter((p) => !uploadedPhotoIds.has(p.uuid))
  if (!effectiveBatch.length) return

  try {
    // Request presigned URLs
    const presignedRes = yield call(
      AxiosWedding.post,
      `photos/uploads/${weddingId}/generate-photo-url`,
      {
        photoIds: effectiveBatch.map((p) => p.uuid),
        extensions: effectiveBatch.map((p) => p.extension),
      }
    )

    const presignedUrls: Array<{ key: string; url: string }> =
      presignedRes.data.presignedUrls || []

    // Track successfully uploaded photos in this batch
    const successfullyUploadedKeys: Array<{ uuid: string; key: string; originalFilename: string }> = []

    // Upload each photo
    for (let i = 0; i < effectiveBatch.length; i++) {
      const item = effectiveBatch[i]
      const s3 = presignedUrls[i]
      if (!s3) continue

      try {
        item.status = "uploading"
        yield call(() => photoDB.queue.put(item))
        yield put(updatePhotoStatus({ weddingId: item.weddingId, uuid: item.uuid, status: "uploading" }))

        const compressed: Blob = yield call(() => {
          const inputFile: File =
            item.file instanceof File
              ? item.file
              : new File([item.file], `${item.uuid}.${item.extension}`, {
                  type: (item.file as Blob).type || "image/jpeg",
                })
          return imageCompression(inputFile, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          })
        })

        // Encrypt the photo if needed before uploading
        const encrypted = yield call(
          () => encryptPhotoIfNeeded(
            compressed,
            albumPublicKey,  // From wedding in Redux
            processPublicKey ?? undefined  // From Redux, not env; ensure undefined not null
          )
        )

        // Log encryption result for debugging


        yield call(
          uploadToS3,
          s3.url,
          encrypted.encryptedBlob,
          item.uuid,
          item.weddingId
        )

        // Persist crypto metadata for registration (IV is embedded in the encrypted blob)
        item.crypto = {
          wrappedPhotoKey: encrypted.wrappedPhotoKey,
          wrappedProcessKey: encrypted.wrappedProcessKey,
        }

        item.status = "completed"
        item.progress = 100
        yield call(() => photoDB.queue.put(item))  // Update status to completed

        yield put(updatePhotoProgress({ weddingId: item.weddingId, uuid: item.uuid, progress: 100 }))
        yield put(updatePhotoStatus({ weddingId: item.weddingId, uuid: item.uuid, status: "completed" }))

        // Only add to successful list if upload completed without errors
        successfullyUploadedKeys.push({ uuid: item.uuid, key: s3.key, originalFilename: item.originalFilename || item.uuid })
      } catch (err) {

        item.retries += 1
        item.status = "failed"
        yield put(updatePhotoStatus({ weddingId: item.weddingId, uuid: item.uuid, status: "failed" }))

        if (item.retries > MAX_RETRIES) {
          yield call(() => photoDB.queue.delete(item.uuid))
        } else {
          yield call(() => photoDB.queue.put(item))
        }
      }
    }

    // Register metadata ONLY for successfully uploaded photos in this batch
    if (successfullyUploadedKeys.length > 0) {
      yield call(registerMetadataForPhotosSaga, weddingId, successfullyUploadedKeys)
    }
  } catch (err) {

  }
}

// Helper saga to register metadata for a list of photos
function* registerMetadataForPhotosSaga(
  weddingId: string,
  photos: Array<{ uuid: string; key: string; originalFilename: string }>
): Generator<any, void, any> {
  try {
    // include the current user's id as `uploadedBy` so backend validation passes
    const state = store.getState()
    const uploadedBy: string = (state?.auth?.user?.id as string) || ""

    // Get albumPublicKey and processPublicKey from the wedding and Redux store
    const weddings: Wedding[] = state?.weddings?.weddings || []
    const currentWedding = weddings.find((w) => w.weddingId === weddingId || w.id === weddingId)
    const albumPublicKey = currentWedding?.albumPublicKey || undefined


    // For each photo, look up the corresponding item in Dexie to get crypto metadata
    const payload = [];
    for (const p of photos) {
      // Try to get the item from Dexie queue (should exist if not yet deleted)
      let dbItem: PendingPhoto | undefined = undefined;
      try {
        dbItem = yield call(() => photoDB.queue.get(p.uuid));
      } catch (e) {
        dbItem = undefined;
      }

      const photoPayload = {
        photoId: p.uuid,
        originalFilename: p.originalFilename,
        storageKey: p.key,
        uploadedBy,
        uploadSource: "ADMIN",
        albumPublicKey: albumPublicKey || undefined,
        wrappedPhotoKey: dbItem?.crypto?.wrappedPhotoKey || undefined,
        wrappedAlbumPrivateKey: undefined,
        wrappedProcessKey: dbItem?.crypto?.wrappedProcessKey || undefined,
      };

      // Log individual photo payload for debugging


      payload.push(photoPayload);
    }

    // Log the complete payload being sent to the API



    // Log the endpoint and response for easier debugging/verification
    try {

    } catch (e) {
      // ignore logging errors
    }

    // Store the uploaded photos response in Redux
    const uploadedPhotosResponse: UploadedPhotoResponse[] = payload.map((p) => ({
      originalFilename: p.originalFilename,
      storageKey: p.storageKey,
      uploadedBy: p.uploadedBy,
      uploadSource: p.uploadSource as "ADMIN",
    }))
    yield put(addUploadedPhotos({ weddingId, photos: uploadedPhotosResponse }))

    // Mark all photos as having metadata registered and remove from queue

    
    for (const photo of photos) {
      try {
        yield call(() => photoDB.queue.delete(photo.uuid))

      } catch (deleteErr) {

      }
      // Record globally to prevent re-enqueue attempts from generating duplicate metadata
      uploadedPhotoIds.add(photo.uuid)
    }

    // Also delete any completed items that might be stuck in the queue
    const completedItems: PendingPhoto[] = yield call(() =>
      photoDB.queue.where("status").equals("completed").toArray()
    )

    for (const item of completedItems) {
      yield call(() => photoDB.queue.delete(item.uuid))
      uploadedPhotoIds.add(item.uuid)
    }

    // Check if all uploads are complete after removing from queue
    const remainingItems: PendingPhoto[] = yield call(() => photoDB.queue.toArray())

    
    // Close the modal - queue should be empty now
    if (remainingItems.length === 0) {

      yield put(uploadPhotosCompleted())
      hasUploadBeenRequested = false
    } else {
      // Force complete if all remaining are completed status
      const allCompleted = remainingItems.every(item => item.status === "completed")
      if (allCompleted) {
        // Delete all completed and close
        for (const item of remainingItems) {
          yield call(() => photoDB.queue.delete(item.uuid))
        }
        yield put(uploadPhotosCompleted())
        hasUploadBeenRequested = false
      }
    }
  } catch (err) {

    // Even on error, close the modal
    yield put(uploadPhotosCompleted())
    hasUploadBeenRequested = false
  }
}

export function* photoSaga(): Generator<any, void, any> {
  yield all([
    takeEvery(uploadPhotosRequest.type, enqueuePhotosSaga),
    processUploadQueue(), // runs forever
  ])
}
