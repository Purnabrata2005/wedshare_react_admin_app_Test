import { call, put, takeLatest } from "redux-saga/effects"
import type { SagaIterator } from "redux-saga"
import type { AxiosProgressEvent } from "axios"
import { toast } from "sonner"

import AxiosWedding from "../service/axiosWedding"

import {
  uploadPhotosPayloadSchema,
  uploadedPhotoResponseSchema,
} from "../schemas/photoSchemas"

import {
  uploadPhotosRequest,
  uploadPhotosEnqueued,
  uploadPhotosCompleted,
  uploadPhotosFailure,
  updatePhotoProgress,
  updatePhotoStatus,
  addUploadedPhotos,
} from "../slices/photoSlice"

/* =======================
   UPLOAD PHOTOS
======================= */

function* uploadPhotosSaga(
  action: ReturnType<typeof uploadPhotosRequest>
): SagaIterator {
  try {
    // Validate payload
    const validation = uploadPhotosPayloadSchema.safeParse(action.payload)
    if (!validation.success) {
      const msg = validation.error.issues[0].message
      yield put(uploadPhotosFailure(msg))
      toast.error(msg)
      return
    }

    const { weddingId, photos } = action.payload

    yield put(uploadPhotosEnqueued())

    const formData = new FormData()
    formData.append("weddingId", weddingId)

    photos.forEach((p) => {
      formData.append("photos", p.file)
      formData.append("uuids", p.uuid)
    })

    const response = yield call(() =>
      AxiosWedding.post("/photos/upload", formData, {
        onUploadProgress: (e: AxiosProgressEvent) => {
          const progress = Math.round((e.loaded * 100) / (e.total || 1))
          photos.forEach((p) => {
            put(updatePhotoProgress({ weddingId, uuid: p.uuid, progress }))
          })
        },
      })
    )

    const uploaded = response?.data?.photos || []

    const validatedPhotos = uploaded.filter((p: any) =>
      uploadedPhotoResponseSchema.safeParse(p).success
    )

    yield put(
      addUploadedPhotos({
        weddingId,
        photos: validatedPhotos,
      })
    )

    photos.forEach((p) =>
      put(updatePhotoStatus({ weddingId, uuid: p.uuid, status: "completed" }))
    )

    yield put(uploadPhotosCompleted())
    toast.success("Photos uploaded successfully")
  } catch (err: any) {
    const msg = err?.response?.data?.message || "Photo upload failed"
    yield put(uploadPhotosFailure(msg))
    toast.error(msg)
  }
}

/* =======================
   ROOT
======================= */

export default function* photoSaga(): SagaIterator {
  yield takeLatest(uploadPhotosRequest.type, uploadPhotosSaga)
}
