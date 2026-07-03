import { Hono } from "hono";

export const totaleAanvraag = new Hono();

totaleAanvraag.get("/", (c) => c.json({ message: "List all items" }));
