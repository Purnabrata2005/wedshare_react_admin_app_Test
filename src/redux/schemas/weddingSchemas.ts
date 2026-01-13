import { z } from "zod";

/* =======================
   WEDDING SCHEMA
======================= */

export const weddingSchema = z.object({
  id: z.string().optional(),
  weddingId: z.string().min(1, "Wedding ID is required"),
  groomName: z.string().min(2, "Groom name must be at least 2 characters"),
  brideName: z.string().min(2, "Bride name must be at least 2 characters"),
  weddingDate: z.string().min(1, "Wedding date is required"),
  weddingVenue: z.string().min(3, "Wedding venue must be at least 3 characters"),
  weddingTime: z.string().min(1, "Wedding time is required"),
  receptionDate: z.string().min(1, "Reception date is required"),
  receptionVenue: z.string().min(3, "Reception venue must be at least 3 characters"),
  receptionTime: z.string().min(1, "Reception time is required"),
  invitationTemplate: z.number().nullable().optional(),
  invitationText: z.string().nullable().optional(),
  coverImageKey: z.string().nullable().optional(),
  albumPublicKey: z.string().nullable().optional(),
  createdBy: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  processPublicKey: z.string().nullable().optional(),
});

export type WeddingData = z.infer<typeof weddingSchema>;

/* =======================
   CREATE WEDDING VALIDATION
======================= */

export const createWeddingSchema = z.object({
  groomName: z.string().min(2, "Groom name must be at least 2 characters"),
  brideName: z.string().min(2, "Bride name must be at least 2 characters"),
  weddingDate: z.string().min(1, "Wedding date is required"),
  weddingVenue: z.string().min(3, "Wedding venue must be at least 3 characters"),
  weddingTime: z.string().min(1, "Wedding time is required"),
  receptionDate: z.string().min(1, "Reception date is required"),
  receptionVenue: z.string().min(3, "Reception venue must be at least 3 characters"),
  receptionTime: z.string().min(1, "Reception time is required"),
  invitationTemplate: z.number().nullable().optional(),
  invitationText: z.string().nullable().optional(),
  coverImageKey: z.string().nullable().optional(),
});

export type CreateWeddingFormData = z.infer<typeof createWeddingSchema>;

/* =======================
   UPDATE WEDDING VALIDATION
======================= */

export const updateWeddingSchema = z.object({
  groomName: z.string().min(2, "Groom name must be at least 2 characters").optional(),
  brideName: z.string().min(2, "Bride name must be at least 2 characters").optional(),
  weddingDate: z.string().min(1, "Wedding date is required").optional(),
  weddingVenue: z.string().min(3, "Wedding venue must be at least 3 characters").optional(),
  weddingTime: z.string().min(1, "Wedding time is required").optional(),
  receptionDate: z.string().min(1, "Reception date is required").optional(),
  receptionVenue: z.string().min(3, "Reception venue must be at least 3 characters").optional(),
  receptionTime: z.string().min(1, "Reception time is required").optional(),
  invitationTemplate: z.number().nullable().optional(),
  invitationText: z.string().nullable().optional(),
  coverImageKey: z.string().nullable().optional(),
  albumPublicKey: z.string().nullable().optional(),
});

export type UpdateWeddingFormData = z.infer<typeof updateWeddingSchema>;

/* =======================
   DELETE WEDDING VALIDATION
======================= */

export const deleteWeddingSchema = z.object({
  weddingId: z.string().min(1, "Wedding ID is required"),
});
