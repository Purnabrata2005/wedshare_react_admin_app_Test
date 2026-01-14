import { z } from "zod"
import { weddingSchema } from "@/redux/schemas/weddingSchemas"

const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/ // HH:mm

export const addWeddingFormSchema = z
  .object({
    groom: weddingSchema.shape.groomName,
    bride: weddingSchema.shape.brideName,

    date: weddingSchema.shape.weddingDate,
    time: z.string().regex(timeRegex, "Invalid time (HH:mm)"),

    venue: weddingSchema.shape.weddingVenue,

    receptionSame: z.boolean(),

    receptionDate: weddingSchema.shape.receptionDate.optional(),
    receptionTime: z.string().optional(),
    receptionVenue: weddingSchema.shape.receptionVenue.optional(),

    invitationTemplate: z.number().min(1, "Select invitation template"),
  })
  .superRefine((data, ctx) => {
    if (!data.receptionSame) {
      if (!data.receptionDate) {
        ctx.addIssue({
          path: ["receptionDate"],
          message: "Reception date is required",
          code: z.ZodIssueCode.custom,
        })
      }
      if (!data.receptionTime) {
        ctx.addIssue({
          path: ["receptionTime"],
          message: "Reception time is required",
          code: z.ZodIssueCode.custom,
        })
      }
      if (!data.receptionVenue) {
        ctx.addIssue({
          path: ["receptionVenue"],
          message: "Reception venue is required",
          code: z.ZodIssueCode.custom,
        })
      }
    }
  })

export type WeddingFormData = z.infer<typeof addWeddingFormSchema>
