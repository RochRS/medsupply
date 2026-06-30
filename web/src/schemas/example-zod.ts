import { z } from "zod";

// 1. Validates the frontend login form before sending network requests
export const loginSchema = z.object({
  email: z.string().email("Vul een geldig e-mailadres in"),
  password: z.string().min(6, "Wachtwoord moet minimaal 6 tekens bevatten"),
});

// 2. Validates and casts type safety onto incoming Hono API backend data
export const supplyItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number(),
});

// Export the type inferred from Zod so your components can use it
export type SupplyItem = z.infer<typeof supplyItemSchema>;
