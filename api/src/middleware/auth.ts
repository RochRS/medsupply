import { createMiddleware } from "hono/factory";
import { auth } from "../auth/auth.js";
import type { AppEnv } from "../types/hono.js";
import { ERROR_CODE_MAP } from "../constants/http-status-codes.js";

// Read the session cookie and put user/session on the request context
// Safe for all routes — guest users just get null
export const loadSession = createMiddleware<AppEnv>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  c.set("user", session?.user ?? null);
  c.set("session", session?.session ?? null);

  await next();
});

// Block the request if there is no logged-in user (401)
export const requireAuth = createMiddleware<AppEnv>(async (c, next) => {
  const user = c.get("user");
  const session = c.get("session");

  if (!user || !session) {
    return c.json(
      { message: "Unauthorized", error: "AUTHENTICATION_REQUIRED" },
      ERROR_CODE_MAP.UNAUTHORIZED,
    );
  }

  await next();
});
