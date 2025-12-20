// src/redux/slices/photoSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { UploadStatus } from "@/DB/uploadDB"

export interface UploadPhotosPayload {
  weddingId: string
  photos: {
    uuid: string
    file: File
    extension: string
    originalFilename: string
  }[]
}

// Response from API after successful upload
export interface UploadedPhotoResponse {
  originalFilename: string
  storageKey: string
  uploadedBy: string
  uploadSource: "ADMIN" | "USER"
}

interface PhotoItemState {
  progress: number
  status: UploadStatus
  originalFilename?: string
  storageKey?: string
}

interface PhotoState {
  // Organized by weddingId, then by uuid
  byWeddingId: Record<string, Record<string, PhotoItemState>>
  // Uploaded photos response from server
  uploadedPhotos: Record<string, UploadedPhotoResponse[]>
  uploading: boolean
  error: string | null
}

const initialState: PhotoState = {
  byWeddingId: {},
  uploadedPhotos: {},
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
      state.uploadedPhotos = {}
      state.uploading = false
      state.error = null
    },

    cancelUpload: (state) => {
      state.uploading = false
      state.error = null
    },

    // Add uploaded photos from server response
    addUploadedPhotos: (
      state,
      action: PayloadAction<{ weddingId: string; photos: UploadedPhotoResponse[] }>
    ) => {
      const { weddingId, photos } = action.payload
      if (!state.uploadedPhotos[weddingId]) {
        state.uploadedPhotos[weddingId] = []
      }
      state.uploadedPhotos[weddingId].push(...photos)
    },

    // Clear uploaded photos for a wedding
    clearUploadedPhotos: (state, action: PayloadAction<string>) => {
      const weddingId = action.payload
      delete state.uploadedPhotos[weddingId]
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
  addUploadedPhotos,
  clearUploadedPhotos,
} = photoSlice.actions

export default photoSlice.reducer
