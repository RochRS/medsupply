import { Hono } from "hono";
export const dashboard = new Hono();
dashboard.get("/", (c) => c.json({ message: "List all items" }));
