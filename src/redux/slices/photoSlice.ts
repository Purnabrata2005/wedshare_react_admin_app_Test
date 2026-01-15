import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { UploadStatus } from "@/DB/uploadDB"

/* ======================
   TYPES
====================== */

export interface UploadPhotosPayload {
  weddingId: string
  photos: {
    uuid: string
    file: File
    extension: string
    originalFilename: string
  }[]
}

interface PhotoItemState {
  progress: number
  status: UploadStatus
  error?: string
}

interface PhotoState {
  byWeddingId: Record<string, Record<string, PhotoItemState>>
  activeUploads: number
  maxConcurrentUploads: number
}

/* ======================
   INITIAL STATE
====================== */

const initialState: PhotoState = {
  byWeddingId: {},
  activeUploads: 0,
  maxConcurrentUploads: 4,
}

/* ======================
   SLICE
====================== */

const photoSlice = createSlice({
  name: "photos",
  initialState,
  reducers: {
    /**
     * V3 ENTRY POINT
     * Enqueue photos for upload
     */
    uploadPhotosRequest(
      state,
      action: PayloadAction<UploadPhotosPayload>
    ) {
      const { weddingId, photos } = action.payload

      state.byWeddingId[weddingId] ??= {}

      for (const p of photos) {
        state.byWeddingId[weddingId][p.uuid] = {
          progress: 0,
          status: "queued",
        }
      }
    },

    updatePhotoProgress(
      state,
      action: PayloadAction<{
        weddingId: string
        uuid: string
        progress: number
      }>
    ) {
      const { weddingId, uuid, progress } = action.payload
      state.byWeddingId[weddingId] ??= {}
      state.byWeddingId[weddingId][uuid] ??= {
        progress: 0,
        status: "queued",
      }
      state.byWeddingId[weddingId][uuid].progress = progress
    },

    updatePhotoStatus(
      state,
      action: PayloadAction<{
        weddingId: string
        uuid: string
        status: UploadStatus
        error?: string
      }>
    ) {
      const { weddingId, uuid, status, error } = action.payload
      state.byWeddingId[weddingId] ??= {}
      state.byWeddingId[weddingId][uuid] ??= {
        progress: 0,
        status,
      }
      state.byWeddingId[weddingId][uuid].status = status
      if (error) {
        state.byWeddingId[weddingId][uuid].error = error
      }
    },

    pausePhoto(
      state,
      action: PayloadAction<{ weddingId: string; uuid: string }>
    ) {
      state.byWeddingId[action.payload.weddingId][
        action.payload.uuid
      ].status = "paused"
    },

    resumePhoto(
      state,
      action: PayloadAction<{ weddingId: string; uuid: string }>
    ) {
      state.byWeddingId[action.payload.weddingId][
        action.payload.uuid
      ].status = "queued"
    },

    cancelPhoto(
      state,
      action: PayloadAction<{ weddingId: string; uuid: string }>
    ) {
      state.byWeddingId[action.payload.weddingId][
        action.payload.uuid
      ].status = "cancelled"
    },
  },
})

/* ======================
   EXPORTS
====================== */

export const {
  uploadPhotosRequest,
  updatePhotoProgress,
  updatePhotoStatus,
  pausePhoto,
  resumePhoto,
  cancelPhoto,
} = photoSlice.actions

export default photoSlice.reducer
