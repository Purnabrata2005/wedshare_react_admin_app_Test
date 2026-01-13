// src/redux/sagas/photoSaga.ts
import { all, call, put, delay, takeEvery, select } from "redux-saga/effects"
import AxiosWedding from "@/redux/service/axiosWedding"
import imageCompression from "browser-image-compression"
import { photoDB, type PendingPhoto } from "@/DB/uploadDB"
import { encryptPhotoIfNeeded } from "@/crypto/photoEncryption"
import { toast } from "sonner"
import { 
  uploadPhotosPayloadSchema, 
  encryptionKeysSchema,
  batchMetadataSchema 
} from "../schemas/photoSchemas"




import {
  uploadPhotosRequest,
  uploadPhotosEnqueued,
  uploadPhotosCompleted,
  uploadPhotosFailure,
  updatePhotoProgress,
  updatePhotoStatus,
} from "@/redux/slices/photoSlice"
import type { UploadPhotosPayload,  } from "@/redux/slices/photoSlice"
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
    // Validate input payload
    const validationResult = uploadPhotosPayloadSchema.safeParse(action.payload);
    
    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues[0].message;
      yield put(uploadPhotosFailure(errorMessage));
      ;
      return;
    }

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
      toast.success("All photos uploaded successfully!", {
        description: "Your photos are now available in the wedding album"
      })
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
  if (!batch.length) return;

  const weddingId = batch[0].weddingId;

  // Get albumPublicKey and processPublicKey from Redux store
  const state = yield select();
  const weddings = state?.weddings?.weddings || [];
  const currentWedding = weddings.find(
    (w: any) => w.weddingId === weddingId || w.id === weddingId
  );
  const albumPublicKey = currentWedding?.albumPublicKey;
  const processPublicKey = currentWedding?.processPublicKey;

  // Log the keys before validation
  console.log("albumPublicKey for wedding", weddingId, ":", albumPublicKey);
  console.log("processPublicKey:", processPublicKey);

  // Validate encryption keys
  const keysValidation = encryptionKeysSchema.safeParse({
    albumPublicKey: albumPublicKey || "",
    processPublicKey: processPublicKey || "",
  });

  if (!keysValidation.success) {
    
    return;
  }

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
            albumPublicKey ?? undefined,  // From wedding in Redux, ensure undefined not null
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
        console.error("[uploadBatchSaga] Error uploading photo:", err, item)
        item.retries += 1
        item.status = "failed"
        yield put(updatePhotoStatus({ weddingId: item.weddingId, uuid: item.uuid, status: "failed" }))

        if (item.retries > MAX_RETRIES) {
          yield call(() => photoDB.queue.delete(item.uuid))
          toast.error("Photo upload failed", {
            description: `${item.originalFilename || 'Photo'} failed after ${MAX_RETRIES} attempts`
          })
        } else {
          yield call(() => photoDB.queue.put(item))
          toast.warning("Photo upload retry", {
            description: `Retrying upload (${item.retries}/${MAX_RETRIES})...`
          })
        }
      }
    }

    // Register metadata ONLY for successfully uploaded photos in this batch
    if (successfullyUploadedKeys.length > 0) {
      yield call(registerMetadataForPhotosSaga, weddingId, successfullyUploadedKeys)
    }
  } catch (err) {
    console.error("[uploadBatchSaga] Batch upload error:", err, batch)
  }
}

// Helper saga to register metadata for a list of photos
function* registerMetadataForPhotosSaga(
  weddingId: string,
  photos: Array<{ uuid: string; key: string; originalFilename: string }>
): Generator<any, void, any> {
  try {
    const state = store.getState();
    const uploadedBy: string = (state.auth.user?.userid as string) || "";

    const payload = [];
    for (const p of photos) {
      let dbItem: PendingPhoto | undefined = undefined;
      try {
        dbItem = yield call(() => photoDB.queue.get(p.uuid));
      } catch (e) {
        dbItem = undefined;
      }

      payload.push({
        originalFilename: p.originalFilename,
        photoId: p.uuid,
        storageKey: p.key,
        uploadedBy,
        uploadSource: "ADMIN", // or "ADMIN" if you want
        wrappedPhotoKey: dbItem?.crypto?.wrappedPhotoKey
          ? String(dbItem.crypto.wrappedPhotoKey)
          : "",
        wrappedProcessKey: dbItem?.crypto?.wrappedProcessKey
          ? String(dbItem.crypto.wrappedProcessKey)
          : "",
      });
    }

    if (payload.length > 0) {
      // Validate metadata payload
      const metadataValidation = batchMetadataSchema.safeParse(payload);
      
      if (!metadataValidation.success) {
        const errorMessage = metadataValidation.error.issues[0].message;
        console.error("Metadata validation failed:", errorMessage);
        toast.error("Photo metadata validation failed", {
          description: errorMessage
        });
        return;
      }

      // Log payload shape and sizes of wrapped keys
      console.groupCollapsed(`[POST] weddings/${weddingId}/photos`);
      console.log("payload length:", payload.length);
      console.table(
        payload.map(p => ({
          originalFilename: p.originalFilename,
          photoId: p.photoId,
          storageKey: p.storageKey,
          uploadedBy: p.uploadedBy,
          uploadSource: p.uploadSource,
          wrappedPhotoKey_len: p.wrappedPhotoKey?.length || 0,
          wrappedProcessKey_len: p.wrappedProcessKey?.length || 0,
        }))
      );
      console.log("raw payload:", payload);
      console.groupEnd();

      yield call(
        AxiosWedding.post,
        `weddings/${weddingId}/photos`,
        payload
      );
      // After successful metadata registration, drop completed items from Dexie and mark as uploaded to prevent duplicates
      yield all(
        photos.map((p) => call(() => photoDB.queue.delete(p.uuid)))
      );
      for (const p of photos) {
        uploadedPhotoIds.add(p.uuid);
      }
    }
  } catch (err) {
    console.error('[registerMetadataForPhotosSaga] API error:', err);
    toast.error("Failed to register photo metadata", {
      description: "Photos uploaded but metadata registration failed. Please try again."
    });
    // Optionally handle API error (retry, notify user, etc.)
  }
}

export function* photoSaga(): Generator<any, void, any> {
  yield all([
    takeEvery(uploadPhotosRequest.type, enqueuePhotosSaga),
    processUploadQueue(), // runs forever
  ])
}
