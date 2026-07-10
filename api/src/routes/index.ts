import { Hono } from "hono";

export const login = new Hono();

login.post("/send-login-request", async (c) => {
});

