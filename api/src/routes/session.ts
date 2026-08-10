import { Hono } from "hono";
import { requireAuth } from "../middleware/auth.js";
import type { AppEnv } from "../types/hono.js";

export const session = new Hono<AppEnv>();

// Current user + role for the frontend
session.get("/me", requireAuth, (c) => {
  const user = c.get("user");
  const sessionData = c.get("session");
  const role = c.get("role");

  const authUser = user as {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    createdAt?: Date | string;
  };

  return c.json({
    user: {
      id: authUser.id,
      name: authUser.name,
      email: authUser.email,
      image: authUser.image ?? null,
      roleId: role?.roleId ?? null,
      roleName: role?.roleName ?? null,
      createdAt: authUser.createdAt
        ? new Date(authUser.createdAt).toISOString()
        : null,
    },
    session: {
      id: sessionData!.id,
      expiresAt: sessionData!.expiresAt,
    },
  });
});

session.get("/health", (c) => {
  return c.json({ status: "ok", auth: "ready" });
});
