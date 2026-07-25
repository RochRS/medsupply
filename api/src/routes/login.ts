import { Hono } from "hono";
import { validate } from "../middleware/validate.js";
import { loginSchema } from "../schemas/user-login.js";
import type { AppEnv } from "../types/hono.js";
import type { LoginInput } from "../schemas/user-login.js";

// Demo route: shows sanitize + Zod (does NOT log the user in)
// Real login: POST /api/auth/sign-in/email
export const login = new Hono<AppEnv>();

login.post("/login", validate(loginSchema), async (c) => {
  const body = c.get("validated") as LoginInput;

  return c.json({
    message: "Payload is valid and sanitized",
    email: body.email,
  });
});
