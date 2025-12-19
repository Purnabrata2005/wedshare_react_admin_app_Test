/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Wedding {
  id: string
  weddingId: string
  groomName: string
  brideName: string
  weddingDate: string
  venue: string
  receptionDate: string
  receptionVenue: string
  invitationTemplate: number | null
  invitationText: string | null
  coverImageKey: string | null
  createdBy: string
  createdAt: string
}

interface WeddingState {
  weddings: Wedding[]
  selectedWedding: Wedding | null
  loading: boolean
  error: string | null
}

const initialState: WeddingState = {
  weddings: [],
  selectedWedding: null,
  loading: false,
  error: null,
}

const weddingSlice = createSlice({
  name: "weddings",
  initialState,
  reducers: {
    loadWeddingsRequest: (state) => {
      state.loading = true
    },
    loadWeddingsSuccess: (state, action: PayloadAction<Wedding[]>) => {
      state.weddings = action.payload
      state.loading = false
    },
    loadWeddingsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },

    addWeddingRequest: (state, _action: PayloadAction<any>) => {
      state.loading = true
    },
    addWeddingSuccess: (state, action: PayloadAction<Wedding>) => {
      state.weddings.push(action.payload)
      state.loading = false
    },
    addWeddingFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },

    selectWedding: (state, action: PayloadAction<Wedding>) => {
      state.selectedWedding = action.payload
    },
    clearSelection: (state) => {
      state.selectedWedding = null
    },

    deleteWeddingRequest: (state, _action: PayloadAction<string>) => {
      state.loading = true
    },
    deleteWeddingSuccess: (state, action: PayloadAction<string>) => {
      state.weddings = state.weddings.filter(
        (w) => w.weddingId !== action.payload && w.id !== action.payload
      )
      if (state.selectedWedding?.weddingId === action.payload || state.selectedWedding?.id === action.payload) {
        state.selectedWedding = null
      }
      state.loading = false
    },
    deleteWeddingFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },

    updateWeddingRequest: (state, _action: PayloadAction<{ weddingId: string; data: any }>) => {
      state.loading = true
    },
    updateWeddingSuccess: (state, action: PayloadAction<Wedding>) => {
      const index = state.weddings.findIndex(
        (w) => w.weddingId === action.payload.weddingId || w.id === action.payload.id
      )
      if (index !== -1) {
        state.weddings[index] = action.payload
      }
      if (state.selectedWedding?.weddingId === action.payload.weddingId || state.selectedWedding?.id === action.payload.id) {
        state.selectedWedding = action.payload
      }
      state.loading = false
    },
    updateWeddingFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const {
  loadWeddingsRequest,
  loadWeddingsSuccess,
  loadWeddingsFailure,
  addWeddingRequest,
  addWeddingSuccess,
  addWeddingFailure,
  selectWedding,
  clearSelection,
  deleteWeddingRequest,
  deleteWeddingSuccess,
  deleteWeddingFailure,
  updateWeddingRequest,
  updateWeddingSuccess,
  updateWeddingFailure,
} = weddingSlice.actions

export default weddingSlice.reducer
