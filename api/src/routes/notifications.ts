import { Hono } from "hono";
import type { AppEnv } from "../types/hono.js";
import { ERROR_CODE_MAP } from "../constants/http-status-codes.js";
import { requireRole } from "../middleware/auth.js";
import { ROLE_NAMES } from "../database/seed/seed-roles.js";
import { getNurseNotifications } from "../services/notifications.service.js";

export const notifications = new Hono<AppEnv>();

/** Verpleging: meldingen wanneer aanvragen klaar staan voor ophalen. */
notifications.get("/", requireRole(ROLE_NAMES.VERPLEGING), async (c) => {
  const user = c.get("user");
  if (!user?.id) {
    return c.json(
      { message: "Not authenticated", error: "AUTHENTICATION_REQUIRED" },
      ERROR_CODE_MAP.UNAUTHORIZED,
    );
  }

  try {
    const items = await getNurseNotifications(user.id);
    return c.json({ notifications: items });
  } catch (error) {
    console.error("notifications GET / error:", error);
    return c.json(
      { message: "Could not load notifications", error: "NOTIFICATIONS_FAILED" },
      ERROR_CODE_MAP.INTERNAL_SERVER_ERROR,
    );
  }
});
