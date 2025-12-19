// src/redux/slices/photoSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { UploadStatus } from "@/DB/uploadDB"

export interface UploadPhotosPayload {
  weddingId: string
  photos: {
    uuid: string
    file: File
    extension: string
  }[]
}

interface PhotoItemState {
  progress: number
  status: UploadStatus
}

interface PhotoState {
  // Organized by weddingId, then by uuid
  byWeddingId: Record<string, Record<string, PhotoItemState>>
  uploading: boolean
  error: string | null
}

const initialState: PhotoState = {
  byWeddingId: {},
  uploading: false,
  error: null,
}

const photoSlice = createSlice({
  name: "photos",
  initialState,
  reducers: {
    uploadPhotosRequest: (state, action: PayloadAction<UploadPhotosPayload>) => {
      const { weddingId } = action.payload
      if (!state.byWeddingId[weddingId]) {
        state.byWeddingId[weddingId] = {}
      }
      state.uploading = true
      state.error = null
    },
    uploadPhotosEnqueued: () => {
      // Keep uploading true - it will be set to false by uploadPhotosCompleted
      // This allows the modal to stay visible during the upload process
    },
    uploadPhotosCompleted: (state) => {
      state.uploading = false
      state.error = null
    },
    uploadPhotosFailure: (state, action: PayloadAction<string>) => {
      state.uploading = false
      state.error = action.payload
    },

    updatePhotoProgress: (
      state,
      action: PayloadAction<{ weddingId: string; uuid: string; progress: number }>
    ) => {
      const { weddingId, uuid, progress } = action.payload
      if (!state.byWeddingId[weddingId]) {
        state.byWeddingId[weddingId] = {}
      }
      if (!state.byWeddingId[weddingId][uuid]) {
        state.byWeddingId[weddingId][uuid] = { progress: 0, status: "pending" }
      }
      state.byWeddingId[weddingId][uuid].progress = progress
    },

    updatePhotoStatus: (
      state,
      action: PayloadAction<{ weddingId: string; uuid: string; status: UploadStatus }>
    ) => {
      const { weddingId, uuid, status } = action.payload
      if (!state.byWeddingId[weddingId]) {
        state.byWeddingId[weddingId] = {}
      }
      if (!state.byWeddingId[weddingId][uuid]) {
        state.byWeddingId[weddingId][uuid] = { progress: 0, status }
      }
      state.byWeddingId[weddingId][uuid].status = status
    },

    clearPhotosForWedding: (state, action: PayloadAction<string>) => {
      const weddingId = action.payload
      delete state.byWeddingId[weddingId]
    },

    clearPhotos: (state) => {
      state.byWeddingId = {}
      state.uploading = false
      state.error = null
    },

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
  clearPhotosForWedding,
  clearPhotos,
  cancelUpload,
} = photoSlice.actions

export default photoSlice.reducer
