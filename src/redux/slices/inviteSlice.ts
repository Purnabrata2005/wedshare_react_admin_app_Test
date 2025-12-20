import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Email types based on API (0-indexed)
// 0 = Marriage only, 1 = Reception only, 2 = Both
export const EmailType = {
  MARRIAGE: 0,
  RECEPTION: 1,
  BOTH: 2,
} as const;

export type EmailTypeValue = (typeof EmailType)[keyof typeof EmailType];

// Single email recipient
export interface EmailRecipient {
  to: string;
}

// Email object structure
export interface EmailObject {
  emailType: EmailTypeValue;
  body: EmailRecipient[];
}

// Wedding data for invitation
export interface InviteWeddingData {
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  wedding_time: string;
  wedding_venue: string;
  reception_date: string;
  reception_time: string;
  reception_venue: string;
}

// Send invitation payload
export interface SendInvitationPayload {
  emails: EmailObject[];
  data: InviteWeddingData;
}

// Guest item for UI
export interface GuestItem {
  id: number;
  email: string;
  eventType: "marriage" | "reception" | "both";
}

// Invite state
export interface InviteState {
  guests: GuestItem[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: InviteState = {
  guests: [],
  loading: false,
  error: null,
  success: false,
};

const inviteSlice = createSlice({
  name: "invite",
  initialState,
  reducers: {
    // Add guests to the list
    addGuests: (state, action: PayloadAction<GuestItem[]>) => {
      state.guests = [...state.guests, ...action.payload];
    },

    // Remove a guest from the list
    removeGuest: (state, action: PayloadAction<number>) => {
      state.guests = state.guests.filter((guest) => guest.id !== action.payload);
    },

    // Clear all guests
    clearGuests: (state) => {
      state.guests = [];
    },

    // Send invitation request (Saga listens to this)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sendInvitationAction: (_state, _action: PayloadAction<SendInvitationPayload>) => {},

    // Set loading state
    setInviteLoading: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },

    // Send invitation success
    sendInvitationSuccess: (state) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.guests = [];
    },

    // Send invitation failure
    sendInvitationFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },

    // Reset invite state
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
