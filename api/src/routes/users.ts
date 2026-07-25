import { Hono } from "hono";
import type { AppEnv } from "../types/hono.js";
import { ERROR_CODE_MAP } from "../constants/http-status-codes.js";

export const users = new Hono<AppEnv>();

users.get("/", async (c) => {
  const currentUser = c.get("user");
  if (!currentUser) {
    return c.json({ message: "Not authenticated" }, ERROR_CODE_MAP.UNAUTHORIZED);
  }
  return c.json({ user: currentUser });
});

users.patch("/", async (c) => {
  const currentUser = c.get("user");
  if (!currentUser) {
    return c.json({ message: "Not authenticated" }, ERROR_CODE_MAP.UNAUTHORIZED);
  }

  const body = await c.req.json<{ name?: string; email?: string }>();
  if (!body.name && !body.email) {
    return c.json({ message: "No fields to update" }, ERROR_CODE_MAP.BAD_REQUEST);
  }

  return c.json({ message: "Profile updated" });
});
