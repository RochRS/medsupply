import { createMiddleware } from "hono/factory";
import { auth } from "../auth/auth.js";
import type { AppEnv } from "../types/hono.js";
import { ERROR_CODE_MAP } from "../constants/http-status-codes.js";
import { getUserRole } from "../services/users.service.js";
import type { RoleName } from "../database/seed/seed-roles.js";

// Read the session cookie and put user/session + role on the request context
export const loadSession = createMiddleware<AppEnv>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  c.set("user", session?.user ?? null);
  c.set("session", session?.session ?? null);

  if (session?.user?.id) {
    const role = await getUserRole(session.user.id);
    c.set("role", role);
  } else {
    c.set("role", null);
  }

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

// Require one of the allowed roles
export const requireRole = (...allowed: RoleName[]) =>
  createMiddleware<AppEnv>(async (c, next) => {
    const user = c.get("user");
    const session = c.get("session");
    const role = c.get("role");

    if (!user || !session) {
      return c.json(
        { message: "Unauthorized", error: "AUTHENTICATION_REQUIRED" },
        ERROR_CODE_MAP.UNAUTHORIZED,
      );
    }

    if (!role || !allowed.includes(role.roleName as RoleName)) {
      return c.json(
        { message: "Forbidden", error: "INSUFFICIENT_ROLE" },
        ERROR_CODE_MAP.FORBIDDEN ?? 403,
      );
    }

    await next();
  });
