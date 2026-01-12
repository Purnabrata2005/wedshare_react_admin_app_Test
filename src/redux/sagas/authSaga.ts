import { call, put, takeLatest } from "redux-saga/effects";
import AxiosInstance from "../service/axiosInstance";
import { photoDB } from "@/DB/uploadDB";
import { clearPhotos } from "../slices/photoSlice";
import type { PayloadAction } from "@reduxjs/toolkit";

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

    yield call(() =>
      AxiosInstance.post("/login", {
        username: action.payload.username,
        password: action.payload.password,
      })
    );

    const user = yield call(fetchCurrentUser);
    yield put(loginSuccess(user));

    action.payload.onSuccess?.();
  } catch (error: any) {
    const message =
      error?.response?.data?.message || "Login failed";
    yield put(loginFailure(message));
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
    yield call(() =>
      AxiosInstance.post("/login/send-otp", {
        recipient: action.payload.recipient,
        recipientType: action.payload.recipientType,
      })
    );
    yield put(sendOtpSuccess());
    action.payload.onSuccess?.();
  } catch (error: any) {
    const message =
      error?.response?.data?.message || "Failed to send OTP";
    yield put(sendOtpFailure(message));
    action.payload.onError?.(message);
  }
}

function* verifyOtpSaga(action: PayloadAction<VerifyOtpPayload>): Generator<any, void, any> {
  try {
    yield call(() =>
      AxiosInstance.post("/login/otp/web", {
        recipient: action.payload.recipient,
        recipientType: action.payload.recipientType,
        otp: action.payload.otp,
      })
    );

    const user = yield call(fetchCurrentUser);
    yield put(verifyOtpSuccess(user));

    action.payload.onSuccess?.();
  } catch (error: any) {
    const message =
      error?.response?.data?.message || "OTP verification failed";
    yield put(verifyOtpFailure(message));
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
  } catch (error) {
    console.error("Logout failed", error);
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
