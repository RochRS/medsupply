import { Hono } from "hono";

export const statistieken = new Hono();

statistieken.get("/", (c) => c.json({ message: "List all items" }));
