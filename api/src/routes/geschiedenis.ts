import { Hono } from "hono";

export const geschiedenis = new Hono();

geschiedenis.get("/", (c) => c.json({ message: "List all items" }));
