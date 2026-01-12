import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";

import AxiosWedding from "../service/axiosWedding";
import {
  sendInvitationAction,
  setInviteLoading,
  sendInvitationSuccess,
  sendInvitationFailure,
  type SendInvitationPayload,
} from "../slices/inviteSlice";

/* ======================================================
   SAGA
====================================================== */

function* sendInvitationSaga(
  action: PayloadAction<SendInvitationPayload>
): Generator {
  try {
    yield put(setInviteLoading());

    const response = yield call(() =>
      AxiosWedding.post("/invitations/create", action.payload)
    );

    if (response.status === 200 || response.status === 201) {
      yield put(sendInvitationSuccess());
    } else {
      throw new Error("Invitation API returned an error");
    }
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to send invitations";

    yield put(sendInvitationFailure(message));
  }
}

/* ======================================================
   WATCHER
====================================================== */

export default function* inviteSaga() {
  yield takeLatest(
    sendInvitationAction.type,
    sendInvitationSaga
  );
}
