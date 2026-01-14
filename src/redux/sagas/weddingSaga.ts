import { call, put, takeLatest, select } from "redux-saga/effects"
import type { SagaIterator } from "redux-saga"
import { toast } from "sonner"

import {
  createWeddingSchema,
  updateWeddingSchema,
  deleteWeddingSchema,
  weddingSchema,
} from "../schemas/weddingSchemas"

import {
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
} from "../slices/weddingSlice"

import AxiosWedding from "@/redux/service/axiosWedding"
import type { RootState } from "../store"

/* =======================
   HELPERS
======================= */

function* fetchWeddings(): SagaIterator {
  const res = yield call(AxiosWedding.get, "/weddings/users/fetch-weddings")

  const list: any[] = res?.data?.weddings || []
  const processPublicKey = res?.data?.processPublicKey || null

  // Filter out null/undefined values and map to normalized format
  const normalized = list
    .filter((w: any) => w != null) // Remove null/undefined entries
    .map((w: any) => {
      const normalizedWedding = {
        ...w,
        id: w.id || w._id || w.weddingId,
        weddingId: w.weddingId,
        albumPublicKey: w.albumPublicKey || null,
      }

      // Soft validation (never crash UI)
      const validation = weddingSchema.safeParse(normalizedWedding)
      if (!validation.success) {
        console.warn("Wedding validation warning:", validation.error)
      }

      return normalizedWedding
    })

  return { weddings: normalized, processPublicKey }
}

/* =======================
   LOAD
======================= */

function* loadWeddingsSaga(): SagaIterator {
  try {
    const userId: string | undefined = yield select(
      (state: RootState) => state.auth.user?.userid
    )

    if (!userId) {
      yield put(loadWeddingsFailure("User not authenticated"))
      return
    }

    const data = yield call(fetchWeddings)
    yield put(loadWeddingsSuccess(data))
  } catch (err: any) {
    const msg = err.message || "Failed to load weddings"
    yield put(loadWeddingsFailure(msg))
    toast.error(msg)
  }
}

/* =======================
   CREATE
======================= */

function* addWeddingSaga(action: ReturnType<typeof addWeddingRequest>): SagaIterator {
  try {
    const userId: string | undefined = yield select(
      (state: RootState) => state.auth.user?.userid
    )
    if (!userId) {
      const msg = "User not authenticated"
      yield put(addWeddingFailure(msg))
      toast.error(msg)
      return
    }

    const validation = createWeddingSchema.safeParse(action.payload)
    if (!validation.success) {
      const msg = validation.error.issues[0].message
      yield put(addWeddingFailure(msg))
      toast.error(msg)
      return
    }

    const payload = {
      ...action.payload,
      createdBy: action.payload?.createdBy || userId,
    }
    yield call(AxiosWedding.post, "/weddings/register", payload)

    yield put(addWeddingSuccess())
    yield put(loadWeddingsRequest())

    toast.success("Wedding created successfully")
  } catch (err: any) {
    const msg = err.message || "Failed to create wedding"
    yield put(addWeddingFailure(msg))
    toast.error(msg)
  }
}

/* =======================
   UPDATE
======================= */

function* updateWeddingSaga(
  action: ReturnType<typeof updateWeddingRequest>
): SagaIterator {
  try {
    const userId: string | undefined = yield select(
      (state: RootState) => state.auth.user?.userid
    )
    if (!userId) {
      const msg = "User not authenticated"
      yield put(updateWeddingFailure(msg))
      toast.error(msg)
      return
    }

    const { weddingId, data } = action.payload

    const validation = updateWeddingSchema.safeParse(data)
    if (!validation.success) {
      const msg = validation.error.issues[0].message
      yield put(updateWeddingFailure(msg))
      toast.error(msg)
      return
    }

    yield call(AxiosWedding.put, `/weddings/${weddingId}`, data)

    yield put(updateWeddingSuccess())
    yield put(loadWeddingsRequest())

    toast.success("Wedding updated successfully")
  } catch (err: any) {
    const msg = err.message || "Failed to update wedding"
    yield put(updateWeddingFailure(msg))
    toast.error(msg)
  }
}

/* =======================
   DELETE
======================= */

function* deleteWeddingSaga(
  action: ReturnType<typeof deleteWeddingRequest>
): SagaIterator {
  try {
    const userId: string | undefined = yield select(
      (state: RootState) => state.auth.user?.userid
    )
    if (!userId) {
      const msg = "User not authenticated"
      yield put(deleteWeddingFailure(msg))
      toast.error(msg)
      return
    }

    const validation = deleteWeddingSchema.safeParse({
      weddingId: action.payload,
    })

    if (!validation.success) {
      const msg = validation.error.issues[0].message
      yield put(deleteWeddingFailure(msg))
      toast.error(msg)
      return
    }

    yield call(AxiosWedding.delete, `/weddings/${action.payload}`)

    yield put(deleteWeddingSuccess())
    yield put(loadWeddingsRequest())

    toast.success("Wedding deleted successfully")
  } catch (err: any) {
    const msg = err.message || "Failed to delete wedding"
    yield put(deleteWeddingFailure(msg))
    toast.error(msg)
  }
}

/* =======================
   ROOT
======================= */

export default function* weddingSaga(): SagaIterator {
  yield takeLatest(loadWeddingsRequest.type, loadWeddingsSaga)
  yield takeLatest(addWeddingRequest.type, addWeddingSaga)
  yield takeLatest(updateWeddingRequest.type, updateWeddingSaga)
  yield takeLatest(deleteWeddingRequest.type, deleteWeddingSaga)
}
