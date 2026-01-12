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
  isactive?: boolean;
  extradata?: any;
  phoneNumber?: string;
  roles?: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  otpSent: boolean;
  otpLoading: boolean;
  otpError: string | null;
}

/* =======================
   PAYLOADS
======================= */

export interface LoginPayload {
  username: string;
  password: string;
  onSuccess?: () => void;
  onError?: (msg: string) => void;
}

export interface RegisterPayload {
  fullname: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: string;
  onSuccess?: () => void;
  onError?: (msg: string) => void;
}

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
};

/* =======================
   SLICE
======================= */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /* ---------- LOGIN ---------- */
    loginAction: (_state, _action: PayloadAction<LoginPayload>) => {},
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    /* ---------- REGISTER ---------- */
    registerAction: (_state, _action: PayloadAction<RegisterPayload>) => {},
    registerSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    /* ---------- SESSION VERIFY ---------- */
    verifySessionAction: () => {},
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    /* ---------- COMMON ---------- */
    setLoading: (state) => {
      state.loading = true;
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

    /* ---------- LOGOUT ---------- */
    logoutAction: () => {},
  },
});

export const {
  loginAction,
  loginSuccess,
  loginFailure,

  registerAction,
  registerSuccess,
  registerFailure,

  verifySessionAction,
  logoutAction,
  logoutSuccess,

  setLoading,

  sendOtpRequest,
  sendOtpSuccess,
  sendOtpFailure,

  verifyOtpRequest,
  verifyOtpSuccess,
  verifyOtpFailure,
} = authSlice.actions;

export default authSlice.reducer;
