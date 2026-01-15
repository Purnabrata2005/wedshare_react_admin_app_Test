import { call, put, takeLatest } from "redux-saga/effects"
import type { PayloadAction } from "@reduxjs/toolkit"
import AxiosInstance from "../service/axiosInstance"
import { photoDB } from "@/DB/uploadDB"
// FIX: import the named action, not the default reducer
import { clearPhotos } from "../slices/photoSlice"
import { clearWeddings } from "../slices/weddingSlice"
import { clearGuests } from "../slices/inviteSlice"
import { toast } from "sonner"

import {
  sendOtpSchema,
  verifyOtpSchema,
  userSchema,
} from "../schemas/authSchemas"

import {
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

  type SendOtpPayload,
  type VerifyOtpPayload,
} from "../slices/authSlice"

/* =======================
   UPLOAD ABORT HELPER (V3)
======================= */

/**
 * IMPORTANT:
 * Abort all active XMLHttpRequests before clearing DB
 * This prevents orphan uploads after logout
 */
function abortAllActiveUploads() {
  const globalAny = globalThis as any
  const xhrMap: Map<string, XMLHttpRequest> | undefined =
    globalAny.__UPLOAD_XHR_MAP__

  if (!xhrMap) return

  xhrMap.forEach((xhr) => {
    try {
      xhr.abort()
    } catch {
      /* noop */
    }
  })

  xhrMap.clear()
}

/* =======================
   HELPERS
======================= */

function* fetchCurrentUser(): Generator<any, any, any> {
  const response = yield call(() =>
    AxiosInstance.get("/login/verify", { withCredentials: true })
  )
  return response?.data?.data ?? response?.data
}

/* =======================
   OTP
======================= */

function* sendOtpSaga(
  action: PayloadAction<SendOtpPayload>
): Generator<any, void, any> {
  try {
    const validation = sendOtpSchema.safeParse(action.payload)
    if (!validation.success) {
      const msg = validation.error.issues[0].message
      yield put(sendOtpFailure(msg))
      toast.error(msg)
      action.payload.onError?.(msg)
      return
    }

    yield call(() =>
      AxiosInstance.post("/login/send-otp", action.payload)
    )

    yield put(sendOtpSuccess())
    toast.success("OTP sent successfully")
    action.payload.onSuccess?.()
  } catch (error: any) {
    const msg =
      error?.response?.data?.message || "Failed to send OTP"
    yield put(sendOtpFailure(msg))
    toast.error(msg)
    action.payload.onError?.(msg)
  }
}

function* verifyOtpSaga(
  action: PayloadAction<VerifyOtpPayload>
): Generator<any, void, any> {
  try {
    const validation = verifyOtpSchema.safeParse(action.payload)
    if (!validation.success) {
      const msg = validation.error.issues[0].message
      yield put(verifyOtpFailure(msg))
      toast.error(msg)
      action.payload.onError?.(msg)
      return
    }

    yield call(() =>
      AxiosInstance.post("/login/otp/web", action.payload)
    )

    const user = yield call(fetchCurrentUser)

    const parsed = userSchema.safeParse(user)
    if (!parsed.success || !user?.userid) {
      const msg = "User info missing after OTP verification"
      yield put(verifyOtpFailure(msg))
      toast.error(msg)
      return
    }

    yield put(verifyOtpSuccess(user))
    toast.success(`Welcome ${user?.fullname || ""}`)
    action.payload.onSuccess?.()
  } catch (error: any) {
    const msg =
      error?.response?.data?.message ||
      "OTP verification failed"
    yield put(verifyOtpFailure(msg))
    toast.error(msg)
    action.payload.onError?.(msg)
  }
}

/* =======================
   VERIFY SESSION
======================= */

function* verifySessionSaga(
  _action: PayloadAction<void>
): Generator<any, void, any> {
  try {
    const user = yield call(fetchCurrentUser)

    const parsed = userSchema.safeParse(user)
    if (!parsed.success || !user?.userid) {
      yield put(verifySessionFailure())
      return
    }

    yield put(verifySessionSuccess(user))
  } catch {
    yield put(verifySessionFailure())
  }
}

/* =======================
   LOGOUT (V3 SAFE)
======================= */

function* logoutSaga(
  _action: PayloadAction<void>
): Generator<any, void, any> {
  try {
    yield call(() => AxiosInstance.post("/logout"))

    // 🚨 V3: Abort active uploads FIRST
    abortAllActiveUploads()

    // Clear IndexedDB queue
    yield call(() => photoDB.queue.clear())

    // Clear Redux slices
    yield put(clearPhotos())
    yield put(clearWeddings())
    yield put(clearGuests())

    yield put(logoutSuccess())
    toast.info("Logged out successfully")
  } catch {
    toast.error("Logout failed")
  }
}

/* =======================
   ROOT
======================= */

export default function* authSaga(): Generator<any, void, any> {
  yield takeLatest(sendOtpRequest.type, sendOtpSaga)
  yield takeLatest(verifyOtpRequest.type, verifyOtpSaga)
  yield takeLatest(verifySessionAction.type, verifySessionSaga)
  yield takeLatest(logoutAction.type, logoutSaga)
}
