import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/* ======================================================
   EMAIL TYPES (API CONTRACT)
====================================================== */

export const EmailType = {
  MARRIAGE: 0,
  RECEPTION: 1,
  BOTH: 2,
} as const;

export type EmailTypeValue =
  (typeof EmailType)[keyof typeof EmailType];

/* ======================================================
   TYPES
====================================================== */

export interface EmailRecipient {
  to: string;
}

export interface EmailObject {
  emailType: EmailTypeValue;
  body: EmailRecipient[];
}

export interface InviteWeddingData {
  weddingId: string;
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  wedding_time: string;
  wedding_venue: string;
  reception_date: string;
  reception_time: string;
  reception_venue: string;
}

export interface SendInvitationPayload {
  emails: EmailObject[];
  data: InviteWeddingData;
}

export interface GuestItem {
  id: number;
  email: string;
  eventType: "marriage" | "reception" | "both";
}

export interface InviteState {
  guests: GuestItem[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

/* ======================================================
   STATE
====================================================== */

const initialState: InviteState = {
  guests: [],
  loading: false,
  error: null,
  success: false,
};

/* ======================================================
   SLICE
====================================================== */

const inviteSlice = createSlice({
  name: "invite",
  initialState,
  reducers: {
    addGuests: (state, action: PayloadAction<GuestItem[]>) => {
      state.guests.push(...action.payload);
    },

    removeGuest: (state, action: PayloadAction<number>) => {
      state.guests = state.guests.filter(
        (g) => g.id !== action.payload
      );
    },

    clearGuests: (state) => {
      state.guests = [];
    },

    // Saga trigger
    sendInvitationAction: (
      _state,
      _action: PayloadAction<SendInvitationPayload>
    ) => {},

    setInviteLoading: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },

    sendInvitationSuccess: (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.guests = [];
    },

    sendInvitationFailure: (
      state,
      action: PayloadAction<string>
    ) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },

    // 🔑 allow UI to reset success state cleanly
    resetInviteState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
});

export const {
  addGuests,
  removeGuest,
  clearGuests,
  sendInvitationAction,
  setInviteLoading,
  sendInvitationSuccess,
  sendInvitationFailure,
  resetInviteState,
} = inviteSlice.actions;

export default inviteSlice.reducer;
