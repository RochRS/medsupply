import { Hono } from "hono";

import { verifyLoginInput } from "../middleware/email-password-verify-.js";

export const login = new Hono();

login.post("/send-login-request", verifyLoginInput, async (c) => {
  const { userEmail, userPassword } = c.get("authCredentials");
  try {
  } catch (error: any) {}
});
