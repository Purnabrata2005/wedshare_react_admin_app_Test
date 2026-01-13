import { call, put, takeLatest } from "redux-saga/effects";
import AxiosInstance from "../service/axiosInstance";
import { photoDB } from "@/DB/uploadDB";
import { clearPhotos } from "../slices/photoSlice";
import type { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { 
  loginSchema, 
  sendOtpSchema, 
  verifyOtpSchema,
  userSchema 
} from "../schemas/authSchemas";

import {
  loginAction,
  loginSuccess,
  loginFailure,

  // registerAction,
  // registerSuccess,
  // registerFailure,

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

  setLoading,
  type LoginPayload,
  // type RegisterPayload,
  type SendOtpPayload,
  type VerifyOtpPayload,
} from "../slices/authSlice";

/* =======================
   HELPERS
======================= */

function* fetchCurrentUser(): Generator<any, any, any> {
  const response = yield call(() =>
    AxiosInstance.get("/login/verify",{ withCredentials: true })
  );
  return response.data?.data;
}

/* =======================
   LOGIN (ID + PASSWORD)
======================= */

function* loginSaga(action: PayloadAction<LoginPayload>): Generator<any, void, any> {
  try {
    yield put(setLoading());

    // Validate input
    const validationResult = loginSchema.safeParse({
      username: action.payload.username,
      password: action.payload.password,
    });

    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues[0].message;
      yield put(loginFailure(errorMessage));
      toast.error("Validation Error", {
        description: errorMessage
      });
      action.payload.onError?.(errorMessage);
      return;
    }

    yield call(() =>
      AxiosInstance.post("/login", {
        username: action.payload.username,
        password: action.payload.password,
      })
    );

    const user = yield call(fetchCurrentUser);
    
    // Validate user response
    const userValidation = userSchema.safeParse(user);
    if (!userValidation.success) {
      console.warn("User data validation warning:", userValidation.error);
    }
    
    yield put(loginSuccess(user));
    toast.success("Login successful!", {
      description: `Welcome back, ${user?.fullname || 'User'}!`
    });

    action.payload.onSuccess?.();
  } catch (error: any) {
    const message =
      error?.response?.data?.message || "Login failed";
    yield put(loginFailure(message));
    toast.error("Login failed", {
      description: message
    });
    action.payload.onError?.(message);
  }
}

/* =======================
   REGISTER
======================= */

// function* registerSaga(action: PayloadAction<RegisterPayload>): Generator<any, void, any> {
//   try {
//     yield put(setLoading());

//     yield call(() =>
//       AxiosInstance.post("/register", {
//         fullname: action.payload.fullname,
//         lastName: action.payload.lastName,
//         email: action.payload.email,
//         password: action.payload.password,
//         phoneNumber: action.payload.phoneNumber,
//         role: action.payload.role,
//       })
//     );

//     yield put(registerSuccess());

//     // Auto-login via cookie
//     const user = yield call(fetchCurrentUser);
//     yield put(loginSuccess(user));

//     action.payload.onSuccess?.();
//   } catch (error: any) {
//     const message =
//       error?.response?.data?.message || "Registration failed";
//     yield put(registerFailure(message));
//     action.payload.onError?.(message);
//   }
// }

/* =======================
   OTP
======================= */

function* sendOtpSaga(action: PayloadAction<SendOtpPayload>): Generator<any, void, any> {
  try {
    // Validate input
    const validationResult = sendOtpSchema.safeParse({
      recipient: action.payload.recipient,
      recipientType: action.payload.recipientType,
    });

    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues[0].message;
      yield put(sendOtpFailure(errorMessage));
      toast.error("Validation Error", {
        description: errorMessage
      });
      action.payload.onError?.(errorMessage);
      return;
    }

    yield call(() =>
      AxiosInstance.post("/login/send-otp", {
        recipient: action.payload.recipient,
        recipientType: action.payload.recipientType,
      })
    );
    yield put(sendOtpSuccess());
    toast.success("OTP sent successfully", {
      description: `Check your ${action.payload.recipientType === 1 ? 'email' : 'phone'} for the verification code`
    });
    action.payload.onSuccess?.();
  } catch (error: any) {
    const message =
      error?.response?.data?.message || "Failed to send OTP";
    yield put(sendOtpFailure(message));
    toast.error("Failed to send OTP", {
      description: message
    });
    action.payload.onError?.(message);
  }
}

function* verifyOtpSaga(action: PayloadAction<VerifyOtpPayload>): Generator<any, void, any> {
  try {
    // Validate input
    const validationResult = verifyOtpSchema.safeParse({
      recipient: action.payload.recipient,
      recipientType: action.payload.recipientType,
      otp: action.payload.otp,
    });

    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues[0].message;
      yield put(verifyOtpFailure(errorMessage));
      toast.error("Validation Error", {
        description: errorMessage
      });
      action.payload.onError?.(errorMessage);
      return;
    }

    yield call(() =>
      AxiosInstance.post("/login/otp/web", {
        recipient: action.payload.recipient,
        recipientType: action.payload.recipientType,
        otp: action.payload.otp,
      })
    );

    const user = yield call(fetchCurrentUser);
    
    // Validate user response
    const userValidation = userSchema.safeParse(user);
    if (!userValidation.success) {
      console.warn("User data validation warning:", userValidation.error);
    }
    
    yield put(verifyOtpSuccess(user));
    toast.success("Verification successful!", {
      description: `Welcome, ${user?.fullname || 'User'}!`
    });

    action.payload.onSuccess?.();
  } catch (error: any) {
    const message =
      error?.response?.data?.message || "OTP verification failed";
    yield put(verifyOtpFailure(message));
    toast.error("Verification failed", {
      description: message
    });
    action.payload.onError?.(message);
  }
}

/* =======================
   VERIFY SESSION (APP LOAD)
======================= */

function* verifySessionSaga(): Generator<any, void, any> {
  try {
    const user = yield call(fetchCurrentUser);
    yield put(verifySessionSuccess(user));
  } catch {
    yield put(verifySessionFailure());
  }
}

/* =======================
   LOGOUT
======================= */

function* logoutSaga(): Generator<any, void, any> {
  try {
    yield call(() => AxiosInstance.post("/logout"));
    yield call(() => photoDB.queue.clear());
    yield put(clearPhotos());
    yield put(logoutSuccess());
    toast.info("Logged out successfully");
  } catch (error) {
    console.error("Logout failed", error);
    toast.error("Logout failed", {
      description: "An error occurred while logging out"
    });
  }
}

/* =======================
   ROOT
======================= */

export default function* authSaga(): Generator<any, void, any> {
  yield takeLatest(loginAction.type, loginSaga);
  // yield takeLatest(registerAction.type, registerSaga);
  yield takeLatest(sendOtpRequest.type, sendOtpSaga);
  yield takeLatest(verifyOtpRequest.type, verifyOtpSaga);
  yield takeLatest(verifySessionAction.type, verifySessionSaga);
  yield takeLatest(logoutAction.type, logoutSaga);
}
