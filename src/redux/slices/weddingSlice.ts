import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { REHYDRATE } from "redux-persist"
// import { persistenceManager } from "path-to-your-persistence-manager" // Adjust the import based on your project structure

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
    // Handle rehydration from persisted storage
    builder.addCase(REHYDRATE as any, (state, action: any) => {
      if (!action.payload) {
        // No payload, keep initial state
        return
      }

      const inbound = action.payload?.weddings as WeddingState | undefined
      const auth = action.payload?.auth as any | undefined

      // If user is not authenticated, reset weddings
      if (!auth?.isAuthenticated || !auth?.user?.userid) {
        state.weddings = []
        state.selectedWeddingId = null
        state.loading = false
        state.error = null
        state.processPublicKey = null
        return
      }

      // If authenticated, restore persisted wedding data
      if (inbound?.weddings && Array.isArray(inbound.weddings)) {
        state.weddings = inbound.weddings
        state.selectedWeddingId = inbound.selectedWeddingId ?? null
        state.processPublicKey = inbound.processPublicKey ?? null
      }
      
      // Reset loading/error states
      state.loading = false
      state.error = null
    })

    builder
      .addCase("auth/logoutUser/fulfilled", (state) => {
        state.weddings = [];  // Reset wedding data on logout
        state.selectedWeddingId = null;
        state.processPublicKey = null;
        state.loading = false;
        state.error = null;
        
        // Clear persisted wedding data
        localStorage.removeItem('selectedWedding'); // or whatever your key is
        // or use your RYHIDRAT clear method
        // persistenceManager.clearWeddingData();
        
        // Clear other auth data
        localStorage.clear();
        
        // Redirect to login
        // navigateToLogin(); // Uncomment and implement this line based on your navigation setup
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
