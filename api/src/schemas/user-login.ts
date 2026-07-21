import { z } from "zod";

// Shared email rules (always store lowercase)
const emailField = z
  .string()
  .min(1, "E-mailadres is verplicht")
  .email("Ongeldig e-mailadres")
  .max(255, "E-mailadres is te lang")
  .transform((value) => value.toLowerCase());

// Password rules for registration
const passwordField = z
  .string()
  .min(8, "Wachtwoord moet minimaal 8 tekens zijn")
  .max(128, "Wachtwoord is te lang");

// Login body: email + password only (.strict = no extra fields)
export const loginSchema = z
  .object({
    email: emailField,
    password: z.string().min(1, "Wachtwoord is verplicht").max(128),
  })
  .strict();

// Register body: name + email + password
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Naam moet minimaal 2 tekens zijn")
      .max(100, "Naam is te lang"),
    email: emailField,
    password: passwordField,
  })
  .strict();

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
