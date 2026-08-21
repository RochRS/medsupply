import { Hono } from "hono";
import type { AppEnv } from "../types/hono.js";
import { ERROR_CODE_MAP } from "../constants/http-status-codes.js";
import { requireRole } from "../middleware/auth.js";
import { ROLE_NAMES } from "../database/seed/seed-roles.js";
import { updateAppSettingsSchema } from "../schemas/app-settings.js";
import { getAppName, setAppName } from "../services/app-settings.service.js";

export const settings = new Hono<AppEnv>();

// Public: any visitor (including the login screen) can read the app name
settings.get("/", async (c) => {
  try {
    const appName = await getAppName();
    return c.json({ appName });
  } catch (error) {
    console.error("settings GET / error:", error);
    return c.json(
      { message: "Could not load settings", error: "SETTINGS_FETCH_FAILED" },
      ERROR_CODE_MAP.INTERNAL_SERVER_ERROR,
    );
  }
});

// Admin: rename the application everywhere
settings.patch("/", requireRole(ROLE_NAMES.ADMIN), async (c) => {
  const parsed = updateAppSettingsSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    return c.json(
      {
        message: parsed.error.issues[0]?.message ?? "Invalid input",
        error: "VALIDATION_ERROR",
      },
      ERROR_CODE_MAP.BAD_REQUEST,
    );
  }

  try {
    const appName = await setAppName(parsed.data.appName);
    return c.json({ appName });
  } catch (error) {
    console.error("settings PATCH / error:", error);
    return c.json(
      { message: "Could not update settings", error: "SETTINGS_UPDATE_FAILED" },
      ERROR_CODE_MAP.INTERNAL_SERVER_ERROR,
    );
  }
});
