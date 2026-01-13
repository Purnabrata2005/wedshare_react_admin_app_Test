import { z } from "zod";

/* =======================
   BASE WEDDING ENTITY
======================= */

export const weddingSchema = z.object({
  id: z.string().optional(),
  weddingId: z.string().optional(), // FIXED: optional

  groomName: z.string().min(1, "Groom name must be at least 1 characters").regex(/^[a-zA-Z]+$/, "Groom name can only contain letters"),
  brideName: z.string().min(1, "Bride name must be at least 1 characters").regex(/^[a-zA-Z]+$/, "Bride name can only contain letters"),

  weddingDate: z.string().min(1, "Wedding date is required"),
  weddingVenue: z.string().min(1, "Wedding venue must be at least 1 characters").regex(/^[a-zA-Z]+$/, "Wedding venue can only contain letters"),
  weddingTime: z.string().min(1, "Wedding time is required"),

  receptionDate: z.string().min(1, "Reception date is required"),
  receptionVenue: z.string().min(1, "Reception venue must be at least 1 characters"),
  receptionTime: z.string().min(1, "Reception time is required"),

  invitationTemplate: z.number().nullable().optional(),
  invitationText: z.string().nullable().optional(),

  coverImageKey: z.string().nullable().optional(),
  albumPublicKey: z.string().nullable().optional(),

  createdBy: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type WeddingData = z.infer<typeof weddingSchema>;

/* =======================
   CREATE WEDDING
======================= */

export const createWeddingSchema = z.object({
  groomName: z.string().min(1, "Groom name must be at least 1 characters").regex(/^[a-zA-Z]+$/, "Groom name can only contain letters"),
  brideName: z.string().min(1, "Bride name must be at least 1 characters").regex(/^[a-zA-Z]+$/, "Bride name can only contain letters"),

  weddingDate: z.string().min(1, "Wedding date is required"),
  weddingVenue: z.string().min(1, "Wedding venue must be at least 1 characters").regex(/^[a-zA-Z]+$/, "Wedding venue can only contain letters"),
  weddingTime: z.string().min(1, "Wedding time is required"),

  receptionDate: z.string().min(1, "Reception date is required"),
  receptionVenue: z.string().min(1, "Reception venue must be at least 1 characters"),
  receptionTime: z.string().min(1, "Reception time is required"),

  invitationTemplate: z.number().nullable().optional(),
  invitationText: z.string().nullable().optional(),

  coverImageKey: z.string().nullable().optional(),
});

export type CreateWeddingFormData = z.infer<typeof createWeddingSchema>;

/* =======================
   UPDATE WEDDING
======================= */

export const updateWeddingSchema = z.object({
  groomName: z.string().min(1).regex(/^[a-zA-Z]+$/, "Groom name can only contain letters").optional(),
  brideName: z.string().min(1).regex(/^[a-zA-Z]+$/, "Bride name can only contain letters").optional(),

  weddingDate: z.string().min(1).optional(),
  weddingVenue: z.string().min(1).regex(/^[a-zA-Z]+$/, "Wedding venue can only contain letters").optional(),
  weddingTime: z.string().min(1).optional(),

  receptionDate: z.string().min(1).optional(),
  receptionVenue: z.string().min(1).optional(),
  receptionTime: z.string().min(1).optional(),

  invitationTemplate: z.number().nullable().optional(),
  invitationText: z.string().nullable().optional(),

  coverImageKey: z.string().nullable().optional(),
  albumPublicKey: z.string().nullable().optional(),
});

export type UpdateWeddingFormData = z.infer<typeof updateWeddingSchema>;

/* =======================
   DELETE WEDDING
======================= */

export const deleteWeddingSchema = z.object({
  weddingId: z.string().min(1, "Wedding ID is required"),
});
