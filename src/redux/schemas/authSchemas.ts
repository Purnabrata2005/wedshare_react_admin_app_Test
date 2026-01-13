import { z } from "zod";

/* =======================
   USER SCHEMA
======================= */

export const userSchema = z.object({
  userid: z.string().optional(),
  username: z.string().optional(),
  fullname: z.string().optional(),
  lastname: z.string().optional(),
  email: z.string().email().optional(),
  phonenumber: z.string().nullable().optional(),
  isactive: z.boolean().optional(),
  extradata: z.any().optional(),
  phoneNumber: z.string().optional(),
  roles: z.array(z.string()).optional(),
});

/* =======================
   LOGIN VALIDATION
======================= */

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/* =======================
   REGISTER VALIDATION
======================= */

export const registerSchema = z.object({
  fullname: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  role: z.string().min(1, "Role is required"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

/* =======================
   OTP VALIDATION
======================= */

export const sendOtpSchema = z.object({
  recipient: z.string().min(1, "Recipient is required"),
  recipientType: z.number().int().min(0).max(1), // 0 for phone, 1 for email
});

export type SendOtpFormData = z.infer<typeof sendOtpSchema>;

export const verifyOtpSchema = z.object({
  recipient: z.string().min(1, "Recipient is required"),
  recipientType: z.number().int().min(0).max(1),
  otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must contain only numbers"),
});

export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;

/* =======================
   API RESPONSE VALIDATION
======================= */

export const apiResponseSchema = z.object({
  data: z.any(),
  message: z.string().optional(),
  status: z.number().optional(),
});
