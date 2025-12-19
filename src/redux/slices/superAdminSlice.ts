

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

/**
 * Represents the overall state managed by the Super Admin slice.
 * This includes  admin lists, and weddings data.
 */
interface SuperAdminState {
  stats: Record<string, any>; // Dashboard statistics (e.g., total users, weddings, uploads, etc.)
  allAdmins: any[];           // List of all registered admin accounts
  allWeddings: any[];         // List of all weddings across the platform
  status: "idle" | "loading" | "succeeded" | "failed"; // Async operation state tracking
}

/**
 * Initial default state for the Super Admin slice.
 */
const initialState: SuperAdminState = {
  stats: {},        // No stats loaded initially
  allAdmins: [],    // No admins fetched yet
  allWeddings: [],  // No wedding data loaded yet
  status: "idle",   // Idle state at start
};

/**
 * Redux slice that handles Super Admin actions and data.
 */
const superAdminSlice = createSlice({
  name: "superAdmin", // Slice name 
  initialState,
  reducers: {
    /**
     * Updates the Super Admin dashboard statistics.
     */
    fetchPlatformStats(state, action: PayloadAction<Record<string, any>>) {
      state.stats = action.payload;
    },

    /**
     * Stores the list of all admin users in the system.
     * Called after fetching admin data from the backend.
     */
    fetchAllAdmins(state, action: PayloadAction<any[]>) {
      state.allAdmins = action.payload;
    },

    /**
     * Stores the list of all weddings across all admins.
     * Helps the Super Admin view or manage all wedding data.
     */
    fetchAllWeddings(state, action: PayloadAction<any[]>) {
      state.allWeddings = action.payload;
    },

    /**
     * Sets the slice status to "loading" during asynchronous operations.
     */
    setLoading(state) {
      state.status = "loading";
    },
    setSucceeded(state) {
      state.status = "succeeded";
    },
    setFailed(state) {
      state.status = "failed";
    },

  },
});

// Export all generated actions for dispatching in components or thunks
export const {
  fetchPlatformStats,
  fetchAllAdmins,
  fetchAllWeddings,
  setLoading,
  setSucceeded,
  setFailed,
} = superAdminSlice.actions;

// Export the reducer to include it in the main Redux store
export default superAdminSlice.reducer;
