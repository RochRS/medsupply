import { Hono } from "hono";

export const settings = new Hono();

settings.get("/", (c) => c.json({ message: "List all items" }));
