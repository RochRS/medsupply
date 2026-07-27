import { z } from "zod";

// Shared email rules (always store lowercase)
const emailField = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email address")
  .max(255, "Email is too long")
  .transform((value) => value.toLowerCase());

// Password rules for registration
const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long");

// Login body: email + password only (.strict = no extra fields)
export const loginSchema = z
  .object({
    email: emailField,
    password: z.string().min(1, "Password is required").max(128),
  })
  .strict();

// Register body: name + email + password
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),
    email: emailField,
    password: passwordField,
  })
  .strict();

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
