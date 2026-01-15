import { call, delay, fork } from "redux-saga/effects"
import AxiosWedding from "@/redux/service/axiosWedding"
import { photoDB, type PendingPhoto } from "@/DB/uploadDB"
import { encryptPhotoOrFail } from "@/crypto/photoEncryption"
import { store } from "@/redux/store"
import {
  updatePhotoProgress,
  updatePhotoStatus,
} from "@/redux/slices/photoSlice"

const xhrMap = new Map<string, XMLHttpRequest>()

function uploadToS3Abortable(
  url: string,
  blob: Blob,
  uuid: string,
  weddingId: string
) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhrMap.set(uuid, xhr)

    xhr.open("PUT", url)

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        store.dispatch(
          updatePhotoProgress({
            weddingId,
            uuid,
            progress: Math.round((e.loaded / e.total) * 100),
          })
        )
      }
    }

    xhr.onload = () =>
      xhr.status < 300
        ? resolve()
        : reject(new Error("S3 upload failed"))

    xhr.onerror = () => reject(new Error("Network error"))

    xhr.send(blob)
  })
}

function* uploadSinglePhoto(item: PendingPhoto): Generator<any, void, any> {
  try {
    item.status = "uploading"
    yield call(() => photoDB.queue.put(item))

    const presign = yield call(
      AxiosWedding.post,
      `photos/uploads/${item.weddingId}/generate-photo-url`,
      {
        photoIds: [item.uuid],
        extensions: [item.extension],
      }
    )

    const { url, key } = presign.data.presignedUrls[0]

    const encrypted = yield call(
      encryptPhotoOrFail,
      item.file,
      "albumKey",
      "processKey"
    )

    yield call(
      uploadToS3Abortable,
      url,
      encrypted.encryptedBlob,
      item.uuid,
      item.weddingId
    )

    yield call(AxiosWedding.post, `weddings/${item.weddingId}/photos`, [
      {
        photoId: item.uuid,
        storageKey: key,
        originalFilename: item.originalFilename,
        uploadSource: "ADMIN",
      },
    ])

    item.status = "completed"
    item.progress = 100
    item.metadataRegistered = true
    yield call(() => photoDB.queue.put(item))

    store.dispatch(
      updatePhotoStatus({
        weddingId: item.weddingId,
        uuid: item.uuid,
        status: "completed",
      })
    )
  } catch (e: any) {
    item.status = "failed"
    item.lastError = e.message
    yield call(() => photoDB.queue.put(item))

    store.dispatch(
      updatePhotoStatus({
        weddingId: item.weddingId,
        uuid: item.uuid,
        status: "failed",
        error: e.message,
      })
    )
  }
}

function* uploadScheduler(): Generator<any, void, any> {
  while (true) {
    const next: PendingPhoto | undefined = yield call(() =>
      photoDB.queue
        .where("status")
        .equals("queued")
        .sortBy("createdAt")
        .then((r) => r[0])
    )

    if (next) {
      yield fork(uploadSinglePhoto, next)
    }

    yield delay(500)
  }
}

export function* photoSaga() {
  yield fork(uploadScheduler)
}
