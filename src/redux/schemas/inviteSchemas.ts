import { z } from "zod";

/* =======================
   EMAIL TYPES
======================= */

export const EmailType = {
  MARRIAGE: 0,
  RECEPTION: 1,
  BOTH: 2,
} as const;

/* =======================
   EMAIL RECIPIENT SCHEMA
======================= */

export const emailRecipientSchema = z.object({
  to: z.string().email("Invalid email address"),
});

export type EmailRecipientData = z.infer<typeof emailRecipientSchema>;

/* =======================
   EMAIL OBJECT SCHEMA
======================= */

export const emailObjectSchema = z.object({
  emailType: z.union([
    z.literal(EmailType.MARRIAGE),
    z.literal(EmailType.RECEPTION),
    z.literal(EmailType.BOTH),
  ], {
    message: "Invalid email type"
  }),
  body: z.array(emailRecipientSchema).min(1, "At least one recipient is required"),
});

export type EmailObjectData = z.infer<typeof emailObjectSchema>;

/* =======================
   WEDDING DATA SCHEMA
======================= */

export const inviteWeddingDataSchema = z.object({
  weddingId: z.string().min(1, "Wedding ID is required"),
  bride_name: z.string().min(2, "Bride name must be at least 2 characters"),
  groom_name: z.string().min(2, "Groom name must be at least 2 characters"),
  wedding_date: z.string().min(1, "Wedding date is required"),
  wedding_time: z.string().min(1, "Wedding time is required"),
  wedding_venue: z.string().min(3, "Wedding venue must be at least 3 characters"),
  reception_date: z.string().min(1, "Reception date is required"),
  reception_time: z.string().min(1, "Reception time is required"),
  reception_venue: z.string().min(3, "Reception venue must be at least 3 characters"),
});

export type InviteWeddingDataFormData = z.infer<typeof inviteWeddingDataSchema>;

/* =======================
   SEND INVITATION SCHEMA
======================= */

export const sendInvitationSchema = z.object({
  emails: z.array(emailObjectSchema).min(1, "At least one email group is required"),
  data: inviteWeddingDataSchema,
});

export type SendInvitationFormData = z.infer<typeof sendInvitationSchema>;

/* =======================
   GUEST ITEM SCHEMA
======================= */

export const guestItemSchema = z.object({
  id: z.number(),
  email: z.string().email("Invalid email address"),
  eventType: z.enum(["marriage", "reception", "both"], {
    message: "Event type must be marriage, reception, or both"
  }),
});

export type GuestItemData = z.infer<typeof guestItemSchema>;

/* =======================
   ADD GUESTS SCHEMA
======================= */

export const addGuestsSchema = z.array(guestItemSchema).min(1, "At least one guest is required");
