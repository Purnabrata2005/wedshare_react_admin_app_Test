import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";

import AxiosWedding from "../service/axiosWedding";
import { sendInvitationSchema } from "../schemas/inviteSchemas";

import {
  sendInvitationAction,
  setInviteLoading,
  sendInvitationSuccess,
  sendInvitationFailure,
  type SendInvitationPayload,
} from "../slices/inviteSlice";

/* ======================================================
   SEND INVITATION
====================================================== */

function* sendInvitationSaga(
  action: PayloadAction<SendInvitationPayload>
): Generator {
  try {
    yield put(setInviteLoading());

    // Validate payload
    const validation = sendInvitationSchema.safeParse(action.payload);
    if (!validation.success) {
      const msg = validation.error.issues[0].message;
      yield put(sendInvitationFailure(msg));
      toast.error("Validation Error", { description: msg });
      return;
    }

    const response = yield call(() =>
      AxiosWedding.post("/invitations/create", action.payload)
    );

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Invitation API returned an error");
    }

    yield put(sendInvitationSuccess());
    toast.success("Invitations sent successfully", {
      description: "Your wedding invitations have been delivered",
    });
  } catch (error: any) {
    const msg =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to send invitations";

    yield put(sendInvitationFailure(msg));
    toast.error("Failed to send invitations", {
      description: msg,
    });
  }
}

/* ======================================================
   ROOT
====================================================== */

export default function* inviteSaga() {
  yield takeLatest(sendInvitationAction.type, sendInvitationSaga);
}
