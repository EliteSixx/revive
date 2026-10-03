import { z } from "zod";

// Validation for the sign-in forms. Phase 2 reuses these schemas on the server.

export const phoneSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(
      /^\d{10}$/,
      "Enter your 10-digit mobile number, without +91 or spaces",
    ),
});

export const otpSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter the 6-digit code from the SMS"),
});

export const staffSignInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address")
    .pipe(z.email("Enter an email address in the format name@example.com")),
  password: z.string().min(1, "Enter your password"),
});

export type PhoneValues = z.infer<typeof phoneSchema>;
export type OtpValues = z.infer<typeof otpSchema>;
export type StaffSignInValues = z.infer<typeof staffSignInSchema>;
