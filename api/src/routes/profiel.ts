import { Hono } from "hono";

export const profiel = new Hono();

profiel.get("/", (c) => c.json({ message: "List all items" }));
