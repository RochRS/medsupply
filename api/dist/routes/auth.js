import { Hono } from "hono";
export const auth = new Hono();
auth.get("/login", (c) => c.json({ message: "Log in" }));
auth.get("/logout", (c) => c.json({ message: "Log out" }));
