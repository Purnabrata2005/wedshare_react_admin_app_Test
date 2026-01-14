import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

/* =======================
   TYPES
======================= */

export interface Wedding {
  id?: string
  weddingId?: string

  groomName: string
  brideName: string

  weddingDate: string
  weddingVenue: string
  weddingTime: string

  receptionDate: string
  receptionVenue: string
  receptionTime: string

  invitationTemplate?: number | null
  invitationText?: string | null

  coverImageKey?: string | null
  albumPublicKey?: string | null

  createdBy?: string
  createdAt?: string
  updatedAt?: string
}

interface WeddingState {
  weddings: Wedding[]
  selectedWeddingId: string | null   // ✅ ONLY ID (no object)
  loading: boolean
  error: string | null
  processPublicKey: string | null
}

/* =======================
   INITIAL STATE
======================= */

const initialState: WeddingState = {
  weddings: [],
  selectedWeddingId: null,
  loading: false,
  error: null,
  processPublicKey: null,
}

/* =======================
   SLICE
======================= */

const weddingSlice = createSlice({
  name: "weddings",
  initialState,
  reducers: {
    /* ---------- LOAD ---------- */
    loadWeddingsRequest: (state) => {
      state.loading = true
      state.error = null
    },
    loadWeddingsSuccess: (
      state,
      action: PayloadAction<{ weddings: Wedding[]; processPublicKey?: string | null }>
    ) => {
      state.weddings = action.payload.weddings
      state.processPublicKey = action.payload.processPublicKey ?? null
      state.loading = false
    },
    loadWeddingsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },

    /* ---------- CREATE ---------- */
    addWeddingRequest: (state, _action: PayloadAction<any>) => {
      state.loading = true
      state.error = null
    },
    addWeddingSuccess: (state) => {
      state.loading = false
      state.error = null
    },
    addWeddingFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },

    /* ---------- UPDATE ---------- */
    updateWeddingRequest: (
      state,
      _action: PayloadAction<{ weddingId: string; data: any }>
    ) => {
      state.loading = true
      state.error = null
    },
    updateWeddingSuccess: (state) => {
      state.loading = false
      state.error = null
    },
    updateWeddingFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },

    /* ---------- DELETE ---------- */
    deleteWeddingRequest: (state, _action: PayloadAction<string>) => {
      state.loading = true
      state.error = null
    },
    deleteWeddingSuccess: (state) => {
      state.loading = false
      state.error = null
    },
    deleteWeddingFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },

    /* ---------- SELECTION (UI ONLY) ---------- */
    selectWedding: (state, action: PayloadAction<string>) => {
      state.selectedWeddingId = action.payload
    },
    clearSelection: (state) => {
      state.selectedWeddingId = null
    },

    /* ---------- CLEAR ALL (FOR LOGOUT) ---------- */
    clearWeddings: (state) => {
      state.weddings = []
      state.selectedWeddingId = null
      state.loading = false
      state.error = null
      state.processPublicKey = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("auth/logoutUser/fulfilled", (state) => {
        state.weddings = [];  // Reset wedding data on logout
        state.selectedWeddingId = null;
        state.processPublicKey = null;
        state.loading = false;
        state.error = null;
      })
  }
})

/* =======================
   EXPORTS
======================= */

export const {
  loadWeddingsRequest,
  loadWeddingsSuccess,
  loadWeddingsFailure,

  addWeddingRequest,
  addWeddingSuccess,
  addWeddingFailure,

  updateWeddingRequest,
  updateWeddingSuccess,
  updateWeddingFailure,

  deleteWeddingRequest,
  deleteWeddingSuccess,
  deleteWeddingFailure,

  selectWedding,
  clearSelection,
  clearWeddings,
} = weddingSlice.actions

export default weddingSlice.reducer
