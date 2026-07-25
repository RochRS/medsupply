import { Hono } from "hono";
import type { AppEnv } from "../types/hono.js";

export const users = new Hono<AppEnv>();

users.get("/", async (c) => {
  const currentUser = c.get("user");
  if (!currentUser) {
    return c.json({ message: "Not authenticated" }, 401);
  }
  return c.json({ user: currentUser });
});

users.patch("/", async (c) => {
  const currentUser = c.get("user");
  if (!currentUser) {
    return c.json({ message: "Not authenticated" }, 401);
  }

  const body = await c.req.json<{ name?: string; email?: string }>();
  if (!body.name && !body.email) {
    return c.json({ message: "No fields to update" }, 400);
  }

  return c.json({ message: "Profile updated" });
});
