import { z } from "zod";

// Frontend check before we call the API (messages in Dutch for the UI)
export const loginSchema = z
  .object({
    email: z
      .string()
      .min(1, "E-mailadres is verplicht")
      .email("Ongeldig e-mailadres"),
    password: z.string().min(1, "Wachtwoord is verplicht"),
  })
  .strict();

export type LoginInput = z.infer<typeof loginSchema>;
