import { Hono } from "hono";
import { requireAuth } from "../middleware/auth.js";
import type { AppEnv } from "../types/hono.js";

// Extra session helpers for the frontend
// Real login/logout still goes through /api/auth/*
export const sessionRoutes = new Hono<AppEnv>();

// Return the current logged-in user (needs a valid session)
sessionRoutes.get("/me", requireAuth, (c) => {
  const user = c.get("user");
  const session = c.get("session");

  return c.json({
    user,
    session: {
      id: session!.id,
      expiresAt: session!.expiresAt,
    },
  });
});

// Simple health check — no login needed
sessionRoutes.get("/health", (c) => {
  return c.json({ status: "ok", auth: "ready" });
});
