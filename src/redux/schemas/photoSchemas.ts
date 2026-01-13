import { z } from "zod";

/* =======================
   UPLOAD STATUS
======================= */

export const uploadStatusSchema = z.enum(["pending", "uploading", "completed", "failed"]);

export type UploadStatusData = z.infer<typeof uploadStatusSchema>;

/* =======================
   PHOTO ITEM SCHEMA
======================= */

export const photoItemSchema = z.object({
  uuid: z.string().uuid("Invalid photo UUID"),
  file: z.instanceof(File, { message: "Invalid file object" }),
  extension: z.string().min(1, "File extension is required").regex(/^(jpg|jpeg|png|gif|webp|heic)$/i, "Invalid file extension"),
  originalFilename: z.string().min(1, "Original filename is required"),
});

export type PhotoItemData = z.infer<typeof photoItemSchema>;

/* =======================
   UPLOAD PHOTOS PAYLOAD SCHEMA
======================= */

export const uploadPhotosPayloadSchema = z.object({
  weddingId: z.string().min(1, "Wedding ID is required"),
  photos: z.array(photoItemSchema).min(1, "At least one photo is required").max(100, "Maximum 100 photos allowed per upload"),
});

export type UploadPhotosPayloadData = z.infer<typeof uploadPhotosPayloadSchema>;

/* =======================
   UPLOADED PHOTO RESPONSE SCHEMA
======================= */

export const uploadedPhotoResponseSchema = z.object({
  originalFilename: z.string().min(1, "Original filename is required"),
  storageKey: z.string().min(1, "Storage key is required"),
  uploadedBy: z.string().min(1, "Uploaded by is required"),
  uploadSource: z.enum(["ADMIN"], { message: "Upload source must be ADMIN" }),
});

export type UploadedPhotoResponseData = z.infer<typeof uploadedPhotoResponseSchema>;

/* =======================
   PHOTO PROGRESS UPDATE SCHEMA
======================= */

export const photoProgressUpdateSchema = z.object({
  weddingId: z.string().min(1, "Wedding ID is required"),
  uuid: z.string().uuid("Invalid photo UUID"),
  progress: z.number().min(0, "Progress cannot be negative").max(100, "Progress cannot exceed 100"),
});

export type PhotoProgressUpdateData = z.infer<typeof photoProgressUpdateSchema>;

/* =======================
   PHOTO STATUS UPDATE SCHEMA
======================= */

export const photoStatusUpdateSchema = z.object({
  weddingId: z.string().min(1, "Wedding ID is required"),
  uuid: z.string().uuid("Invalid photo UUID"),
  status: uploadStatusSchema,
});

export type PhotoStatusUpdateData = z.infer<typeof photoStatusUpdateSchema>;

/* =======================
   ENCRYPTION KEYS SCHEMA
======================= */

export const encryptionKeysSchema = z.object({
  albumPublicKey: z.string().min(1, "Album public key is required"),
  processPublicKey: z.string().min(1, "Process public key is required"),
});

export type EncryptionKeysData = z.infer<typeof encryptionKeysSchema>;

/* =======================
   PHOTO METADATA SCHEMA
======================= */

export const photoMetadataSchema = z.object({
  originalFilename: z.string().min(1, "Original filename is required"),
  photoId: z.string().uuid("Invalid photo ID"),
  storageKey: z.string().min(1, "Storage key is required"),
  uploadedBy: z.string().min(1, "Uploaded by is required"),
  uploadSource: z.enum(["ADMIN", "USER"]),
  wrappedPhotoKey: z.string().optional(),
  wrappedProcessKey: z.string().optional(),
});

export type PhotoMetadataData = z.infer<typeof photoMetadataSchema>;

/* =======================
   BATCH METADATA SCHEMA
======================= */

export const batchMetadataSchema = z.array(photoMetadataSchema).min(1, "At least one photo metadata is required");
