import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/* =======================
   TYPES
======================= */

export interface User {
  userid?: string;
  username?: string;
  fullname?: string;
  lastname?: string;
  email?: string;
  phonenumber?: string | null;
  phoneNumber?: string;
  roles?: string[];
  isactive?: boolean;
  extradata?: any;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  // OTP
  otpSent: boolean;
  otpLoading: boolean;
  otpError: string | null;

  // App bootstrap flag
  rehydrated: boolean;
}

/* =======================
   PAYLOADS
======================= */

export interface SendOtpPayload {
  recipient: string;
  recipientType: number;
  onSuccess?: () => void;
  onError?: (msg: string) => void;
}

export interface VerifyOtpPayload {
  recipient: string;
  recipientType: number;
  otp: string;
  onSuccess?: () => void;
  onError?: (msg: string) => void;
}

/* =======================
   INITIAL STATE
======================= */

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  otpSent: false,
  otpLoading: false,
  otpError: null,

  rehydrated: false,
};

/* =======================
   SLICE
======================= */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /* ---------- SESSION VERIFY ---------- */
    verifySessionAction: (state) => {
      state.loading = true;
    },
    verifySessionSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      state.rehydrated = true;
    },
    verifySessionFailure: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.rehydrated = true;
    },

    /* ---------- LOGOUT ---------- */
    logoutAction: () => {},
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.rehydrated = true;
    },

    /* ---------- OTP ---------- */
    sendOtpRequest: (state) => {
      state.otpLoading = true;
      state.otpError = null;
      state.otpSent = false;
    },
    sendOtpSuccess: (state) => {
      state.otpLoading = false;
      state.otpSent = true;
    },
    sendOtpFailure: (state, action: PayloadAction<string>) => {
      state.otpLoading = false;
      state.otpError = action.payload;
    },

    verifyOtpRequest: (state) => {
      state.otpLoading = true;
      state.otpError = null;
    },
    verifyOtpSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.otpLoading = false;
      state.otpSent = false;
    },
    verifyOtpFailure: (state, action: PayloadAction<string>) => {
      state.otpLoading = false;
      state.otpError = action.payload;
    },
  },
});

export const {
  verifySessionAction,
  verifySessionSuccess,
  verifySessionFailure,

  logoutAction,
  logoutSuccess,

  sendOtpRequest,
  sendOtpSuccess,
  sendOtpFailure,

  verifyOtpRequest,
  verifyOtpSuccess,
  verifyOtpFailure,
} = authSlice.actions;

export default authSlice.reducer;
