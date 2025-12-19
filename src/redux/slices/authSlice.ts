import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id?: string;
  fullname?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

//  LOGIN PAYLOAD
export interface LoginPayload {
  username: string;
  password: string;
  onSuccess?: () => void;
  onError?: (msg: string) => void;
}

//  REGISTER PAYLOAD
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

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    //  LOGIN REQUEST (Saga listens to this)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loginAction: (_state, _action: PayloadAction<LoginPayload>) => {
      
    },

    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
    },

    loginFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },

    //  REGISTER REQUEST
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    registerAction: (_state, _action: PayloadAction<RegisterPayload>) => {},

    registerSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },

    registerFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },

    //  COMMON
    setLoading: (state) => {
      state.loading = true;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },

    logoutAction: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
    },

    // Initialize auth state from localStorage on app startup
    initializeAuth: (state) => {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          state.user = user;
          state.token = token;
        } catch (error) {
          console.error("Failed to parse stored user data", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    },
  },
});

export const {
  loginAction,
  loginSuccess,
  loginFailure,
  registerAction,
  registerSuccess,
  registerFailure,
  setLoading,
  setError,
  logoutAction,
  initializeAuth,
} = authSlice.actions;

export default authSlice.reducer;
