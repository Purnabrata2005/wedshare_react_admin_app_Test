import { call, put, takeLatest } from "redux-saga/effects";
import AxiosWedding from "../service/axiosWedding";
import type { PayloadAction } from "@reduxjs/toolkit";

import {
  sendInvitationAction,
  setInviteLoading,
  sendInvitationSuccess,
  sendInvitationFailure,
  type SendInvitationPayload,
} from "../slices/inviteSlice";

// SEND INVITATION SAGA
function* sendInvitationSaga(action: PayloadAction<SendInvitationPayload>): Generator<any, void, any> {
  try {
    yield put(setInviteLoading());

    const { emails, data } = action.payload;

    // Make API call to send invitations
    const response = yield call(() =>
      AxiosWedding.post("/email/send", {
        emails,
        data,
      })
    );

    // Check if response is successful
    if (response.status === 200 || response.status === 201) {
      yield put(sendInvitationSuccess());
    } else {
      throw new Error("Failed to send invitations");
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

// WATCHER SAGA
export default function* inviteSaga() {
  yield takeLatest(sendInvitationAction.type, sendInvitationSaga);
}
