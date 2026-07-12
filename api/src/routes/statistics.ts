import { Hono } from "hono";

export const statistics = new Hono();

statistics.get("/", (c) => c.json({ message: "List all items" }));
