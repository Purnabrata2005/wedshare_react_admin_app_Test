import { call, put, takeEvery, select, delay } from "redux-saga/effects"
import type { SagaIterator } from "redux-saga"
import {
  loadWeddingsRequest,
  loadWeddingsSuccess,
  loadWeddingsFailure,
  addWeddingRequest,
  addWeddingSuccess,
  addWeddingFailure,
  deleteWeddingRequest,
  deleteWeddingSuccess,
  deleteWeddingFailure,
  updateWeddingRequest,
  updateWeddingSuccess,
  updateWeddingFailure
} from "../slices/weddingSlice"
import AxiosWedding from "@/redux/service/axiosWedding"
import type { RootState } from "../store";

function* fetchWeddingsSaga(): SagaIterator {
  try {
    // Get userId from Redux state
    let userId: string | undefined = yield select((state: RootState) => state.auth?.user?.userid)
    
    // If userId is not available yet, wait for it (max 5 seconds)
    let attempts = 0;
    while (!userId && attempts < 50) {
      yield delay(100); // Wait 100ms using redux-saga delay
      userId = yield select((state: RootState) => state.auth?.user?.userid);
      attempts++;
    }

    if (!userId) {
      yield put(loadWeddingsFailure("User not authenticated"))
      return
    }

    const res = yield call(AxiosWedding.get, `/weddings/users/fetch-weddings`)
    // Normalize response so frontend has consistent id / weddingId
    const list: any[] = res?.data?.weddings || res?.data || []
    const processPublicKey = res?.data?.processPublicKey || null
    
    const normalized = list.map((w: any) => ({
      ...w,
      id: w.id || w._id || w.weddingId || "",
      weddingId: w.weddingId || "",
      processPublicKey: processPublicKey, // Add root-level processPublicKey to each wedding
      albumPublicKey: w.albumPublicKey || null, // Keep per-wedding albumPublicKey
    }))
    yield put(loadWeddingsSuccess({ weddings: normalized }))
  } catch (err: any) {
    yield put(loadWeddingsFailure(err.message || "Failed to load weddings"))
  }
}

function* saveWeddingSaga(action: ReturnType<typeof addWeddingRequest>): SagaIterator {
  try {
    const res = yield call(
      AxiosWedding.post,
      "weddings/register",
      action.payload
    )
    const created = res?.data?.wedding || res?.data || null
    const normalizedCreated = created
      ? {
          ...created,
          id: created.id || created._id || "",
          weddingId: created.weddingId || action.payload?.weddingId || "",
        }
      : null

    if (normalizedCreated) yield put(addWeddingSuccess(normalizedCreated))
    // After successfully adding a wedding, re-fetch the user's weddings
    // so the store has full wedding details (prevents null details in array)
    const userId: string | undefined = yield select((state: RootState) => state.auth?.user?.userid)
    if (userId) {
      try {
        const listRes = yield call(AxiosWedding.get, `/weddings/users/fetch-weddings`)
        const list: any[] = listRes?.data?.weddings || listRes?.data || []
        const processPublicKey = listRes?.data?.processPublicKey || null
        
        const normalized = list.map((w: any) => ({
          ...w,
          id: w.id || w._id ||  "",
          weddingId: w.weddingId ||  "",
          processPublicKey: processPublicKey,
          albumPublicKey: w.albumPublicKey || null,
        }))
        yield put(loadWeddingsSuccess({ weddings: normalized }))
      } catch (err: any) {
        yield put(loadWeddingsFailure(err.message || "Failed to refresh weddings"))
      }
    }
  } catch (err: any) {
    yield put(addWeddingFailure(err.message || "Failed to add wedding"))
  }
}

function* deleteWeddingSaga(action: ReturnType<typeof deleteWeddingRequest>): SagaIterator {
  try {
    const weddingId = action.payload
    yield call(AxiosWedding.delete, `weddings/${weddingId}`)
    yield put(deleteWeddingSuccess(weddingId))
  } catch (err: any) {
    yield put(deleteWeddingFailure(err.message || "Failed to delete wedding"))
  }
}

function* updateWeddingSaga(action: ReturnType<typeof updateWeddingRequest>): SagaIterator {
  try {
    const { weddingId, data } = action.payload
    const res = yield call(AxiosWedding.put, `weddings/${weddingId}`, data)
    const updated = res?.data?.wedding || res?.data || null
    const normalizedUpdated = updated
      ? {
          ...updated,
          id: updated.id || updated._id || updated.weddingId || weddingId,
          weddingId: updated.weddingId || updated.id || updated._id || weddingId,
        }
      : null

    if (normalizedUpdated) {
      yield put(updateWeddingSuccess(normalizedUpdated))
    }
  } catch (err: any) {
    yield put(updateWeddingFailure(err.message || "Failed to update wedding"))
  }
}

export default function* weddingSaga(): SagaIterator {
  yield takeEvery(loadWeddingsRequest.type, fetchWeddingsSaga)
  yield takeEvery(addWeddingRequest.type, saveWeddingSaga)
  yield takeEvery(deleteWeddingRequest.type, deleteWeddingSaga)
  yield takeEvery(updateWeddingRequest.type, updateWeddingSaga)
}
