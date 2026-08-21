import { z } from "zod";

export const updateAppSettingsSchema = z
  .object({
    appName: z
      .string()
      .trim()
      .min(1, "App name is required")
      .max(100, "App name is too long"),
  })
  .strict();

export type UpdateAppSettingsInput = z.infer<typeof updateAppSettingsSchema>;
