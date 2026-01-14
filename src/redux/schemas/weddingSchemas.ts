import { z } from "zod"

/* =====================================================
   COMMON FIELD VALIDATORS
===================================================== */

const nameSchema = z
  .string()
  .min(1, "Name is required")
  .regex(/^[a-zA-Z\s'.-]+$/, "Only letters and valid characters allowed")

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (yyyy-mm-dd)")

const timeSchema = z
  .string()
  .regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)")

/* =====================================================
   BASE WEDDING DATA (SINGLE SOURCE OF TRUTH)
===================================================== */

export const weddingBaseSchema = z.object({
  groomName: nameSchema,
  brideName: nameSchema,

  weddingDate: dateSchema,
  weddingVenue: z.string().min(1, "Wedding venue is required"),
  weddingTime: timeSchema,

  receptionDate: dateSchema,
  receptionVenue: z.string().min(1, "Reception venue is required"),
  receptionTime: timeSchema,

  invitationTemplate: z.number().nullable().optional(),
  invitationText: z.string().nullable().optional(),

  coverImageKey: z.string().nullable().optional(),
  albumPublicKey: z.string().nullable().optional(),
})

/* =====================================================
   FULL ENTITY (READ MODEL)
===================================================== */

export const weddingSchema = weddingBaseSchema.extend({
  id: z.string(), // SINGLE ID ONLY
  createdBy: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type WeddingData = z.infer<typeof weddingSchema>

/* =====================================================
   CREATE WEDDING
===================================================== */

export const createWeddingSchema = weddingBaseSchema
export type CreateWeddingFormData = z.infer<typeof createWeddingSchema>

/* =====================================================
   UPDATE WEDDING (PATCH SAFE)
===================================================== */

export const updateWeddingSchema = weddingBaseSchema.partial()
export type UpdateWeddingFormData = z.infer<typeof updateWeddingSchema>

/* =====================================================
   DELETE WEDDING
===================================================== */

export const deleteWeddingSchema = z.object({
  id: z.string().min(1, "Wedding ID is required"),
})
