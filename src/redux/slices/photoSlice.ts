import { createSlice,type PayloadAction } from "@reduxjs/toolkit"
import type { UploadStatus } from "@/DB/uploadDB"

/* =======================
   TYPES
======================= */

export interface UploadPhotosPayload {
  weddingId: string
  photos: {
    uuid: string
    file: File
    extension: string
    originalFilename: string
  }[]
}

export interface UploadedPhotoResponse {
  originalFilename: string
  storageKey: string
  uploadedBy: string
  uploadSource: "ADMIN"
}

interface PhotoItemState {
  progress: number
  status: UploadStatus
  originalFilename?: string
  storageKey?: string
}

interface PhotoState {
  byWeddingId: Record<string, Record<string, PhotoItemState>>
  uploadedPhotos: Record<string, UploadedPhotoResponse[]>
  uploading: boolean
  error: string | null
}

/* =======================
   INITIAL STATE
======================= */

const initialState: PhotoState = {
  byWeddingId: {},
  uploadedPhotos: {},
  uploading: false,
  error: null,
}

/* =======================
   SLICE
======================= */

const photoSlice = createSlice({
  name: "photos",
  initialState,
  reducers: {
    /* ---------- UPLOAD ---------- */
    uploadPhotosRequest: (state, action: PayloadAction<UploadPhotosPayload>) => {
      const { weddingId } = action.payload
      state.byWeddingId[weddingId] ||= {}
      state.uploading = true
      state.error = null
    },

    uploadPhotosEnqueued: () => {},

    uploadPhotosCompleted: (state) => {
      state.uploading = false
    },

    uploadPhotosFailure: (state, action: PayloadAction<string>) => {
      state.uploading = false
      state.error = action.payload
    },

    /* ---------- PROGRESS ---------- */
    updatePhotoProgress: (
      state,
      action: PayloadAction<{ weddingId: string; uuid: string; progress: number }>
    ) => {
      const { weddingId, uuid, progress } = action.payload
      state.byWeddingId[weddingId] ||= {}
      state.byWeddingId[weddingId][uuid] ||= { progress: 0, status: "pending" }
      state.byWeddingId[weddingId][uuid].progress = progress
    },

    updatePhotoStatus: (
      state,
      action: PayloadAction<{ weddingId: string; uuid: string; status: UploadStatus }>
    ) => {
      const { weddingId, uuid, status } = action.payload
      state.byWeddingId[weddingId] ||= {}
      state.byWeddingId[weddingId][uuid] ||= { progress: 0, status }
      state.byWeddingId[weddingId][uuid].status = status
    },

    /* ---------- SERVER RESPONSE ---------- */
    addUploadedPhotos: (
      state,
      action: PayloadAction<{ weddingId: string; photos: UploadedPhotoResponse[] }>
    ) => {
      const { weddingId, photos } = action.payload
      state.uploadedPhotos[weddingId] ||= []
      state.uploadedPhotos[weddingId].push(...photos)
    },

    clearUploadedPhotos: (state, action: PayloadAction<string>) => {
      delete state.uploadedPhotos[action.payload]
    },

    /* ---------- CLEANUP ---------- */
    clearPhotosForWedding: (state, action: PayloadAction<string>) => {
      delete state.byWeddingId[action.payload]
      delete state.uploadedPhotos[action.payload]
    },

    clearPhotos: () => initialState,

    cancelUpload: (state) => {
      state.uploading = false
      state.error = null
    },
  },
})

export const {
  uploadPhotosRequest,
  uploadPhotosEnqueued,
  uploadPhotosCompleted,
  uploadPhotosFailure,

  updatePhotoProgress,
  updatePhotoStatus,

  addUploadedPhotos,
  clearUploadedPhotos,

  clearPhotosForWedding,
  clearPhotos,
  cancelUpload,
} = photoSlice.actions

export default photoSlice.reducer
