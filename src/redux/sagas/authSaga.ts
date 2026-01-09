import { call, put, takeLatest } from "redux-saga/effects";
import AxiosInstance from "../service/axiosInstance";
import AxiosGoogle from "../service/axiosGoogle";
import { photoDB } from "@/DB/uploadDB";
import { clearPhotos } from "../slices/photoSlice";

import type { PayloadAction } from "@reduxjs/toolkit";

import {
  loginAction,
  loginSuccess,
  loginFailure,
  registerAction,
  registerSuccess,
  registerFailure,
  setLoading,
  logoutAction,
  sendOtpRequest,
  sendOtpSuccess,
  sendOtpFailure,
  verifyOtpRequest,
  verifyOtpSuccess,
  verifyOtpFailure,
  type LoginPayload,
  type RegisterPayload,
  type SendOtpPayload,
  type VerifyOtpPayload,
} from "../slices/authSlice";
// SEND OTP SAGA
function* sendOtpSaga(action: PayloadAction<SendOtpPayload>): any {
  try {
    yield call(() =>
      AxiosGoogle.post("/login/send-otp", {
        recipient: action.payload.recipient,
        recipientType: action.payload.recipientType,
      })
    );
    yield put(sendOtpSuccess());
    if (action.payload.onSuccess) action.payload.onSuccess();
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to send OTP";
    yield put(sendOtpFailure(message));
    if (action.payload.onError) action.payload.onError(message);
  }
}

// VERIFY OTP SAGA
function* verifyOtpSaga(action: PayloadAction<VerifyOtpPayload>): any {
  try {
    const response = yield call(() =>
      AxiosGoogle.post("/login/otp", {
        recipient: action.payload.recipient,
        recipientType: action.payload.recipientType,
        otp: action.payload.otp,
      })
    );
    const api = response.data?.data;
    if (!api) throw new Error("Invalid API response");
    const token = api.access_token;
    if (!token) throw new Error("Token missing!");
    const user = {
      id: api.userid,
      username: api.username,
      fullname: api.fullname,
      phoneNumber: api.phonenumber,
      email: api.email,
      roles: api.roles,
      profile: null,
    };
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    yield put(verifyOtpSuccess({ user, token }));
    if (action.payload.onSuccess) action.payload.onSuccess();
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "OTP verification failed";
    yield put(verifyOtpFailure(message));
    if (action.payload.onError) action.payload.onError(message);
  }
}


// LOGIN SAGA
function* loginSaga(action: PayloadAction<LoginPayload>): any {
  try {
    yield put(setLoading());

    const response = yield call(() =>
      AxiosInstance.post("/login", {
        username: action.payload.username,
        password: action.payload.password,
      })
    );

    // Backend response structure:
    // { data: { userId, username, fullname, phoneNumber, email, roles, access_token } }
    const api = response.data?.data;

    if (!api) throw new Error("Invalid API response");

    const token = api.access_token;
    if (!token) throw new Error("Token missing!");

    const user = {
      id: api.userId,
      username: api.username,
      fullname: api.fullname,
      phoneNumber: api.phoneNumber,
      email: api.email,
      roles: api.roles,
      profile: null,
    };

    // Save token & user locally
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // Dispatch success
    yield put(loginSuccess({ user, token }));

    // Call success callback if provided
    if (action.payload.onSuccess) action.payload.onSuccess();
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Login failed";

    yield put(loginFailure(message));

    if (action.payload.onError) action.payload.onError(message);
  }
}

// -------------------------------------------------------
// REGISTER SAGA
// -------------------------------------------------------
function* registerSaga(action: PayloadAction<RegisterPayload>): any {
  try {
    yield put(setLoading());

    const response = yield call(() =>
      AxiosInstance.post("/register", {
        fullname: action.payload.fullname,
        lastName: action.payload.lastName,
        email: action.payload.email,
        password: action.payload.password,
        phoneNumber: action.payload.phoneNumber,
        role: action.payload.role,
      })
    );

    yield put(registerSuccess(response.data));

    // Auto-login after successful registration
    // Try to get token from registration response
    const apiData = response.data?.data || response.data;
    let token = apiData?.access_token || apiData?.token;
    
    if (token) {
      // If token exists in registration response, use it directly
      const user = {
        id: apiData?.userId || apiData?.id || "",
        username: apiData?.username || action.payload.email,
        fullname: action.payload.fullname,
        lastName: action.payload.lastName,
        phoneNumber: action.payload.phoneNumber,
        email: action.payload.email,
        roles: apiData?.roles || [action.payload.role],
        profile: null,
      };

      // Save token & user locally
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Dispatch login success to update Redux state
      yield put(loginSuccess({ user, token }));
      
      console.log("✓ User auto-logged in after registration (token from register response)");
    } else {
      // If no token in registration response, login using email and password
      console.log("No token in registration response. Attempting auto-login with credentials...");
      
      try {
        const loginResponse = yield call(() =>
          AxiosInstance.post("/login", {
            username: action.payload.email,
            password: action.payload.password,
          })
        );

        const loginData = loginResponse.data?.data;
        if (!loginData) throw new Error("Invalid login response");

        const loginToken = loginData.access_token;
        if (!loginToken) throw new Error("Token missing from login!");

        const user = {
          id: loginData.userId,
          username: loginData.username || action.payload.email,
          fullname: loginData.fullname || action.payload.fullname,
          phoneNumber: loginData.phoneNumber || action.payload.phoneNumber,
          email: loginData.email || action.payload.email,
          roles: loginData.roles,
          profile: null,
        };

        // Save token & user locally
        localStorage.setItem("token", loginToken);
        localStorage.setItem("user", JSON.stringify(user));

        // Dispatch login success to update Redux state
        yield put(loginSuccess({ user, token: loginToken }));
        
        console.log("✓ User auto-logged in after registration (via login endpoint)");
      } catch (loginError: any) {
        console.warn("Auto-login failed after registration. User should login manually.", loginError.message);
      }
    }

    if (action.payload.onSuccess) action.payload.onSuccess();
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Registration failed";

    yield put(registerFailure(message));

    if (action.payload.onError) action.payload.onError(message);
  }
}

// -------------------------------------------------------
// LOGOUT SAGA
// -------------------------------------------------------
function* logoutSaga(): any {
  try {
    // Clear Dexie photo queue database
    yield call(() => photoDB.queue.clear());

    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Dispatch action to clear Redux photo state
    yield put(clearPhotos());
  } catch (error: any) {
    console.error("Logout saga error:", error);
  }
}

// -------------------------------------------------------
// ROOT SAGA
// -------------------------------------------------------
export default function* authSaga() {
  yield takeLatest(loginAction.type, loginSaga);
  yield takeLatest(registerAction.type, registerSaga);
  yield takeLatest(logoutAction.type, logoutSaga);
  yield takeLatest(sendOtpRequest.type, sendOtpSaga);
  yield takeLatest(verifyOtpRequest.type, verifyOtpSaga);
}
