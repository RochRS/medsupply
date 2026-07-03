import { Hono } from "hono";

export const aanvraag = new Hono();

aanvraag.get("/", (c) => c.json({ message: "List all items" }));
