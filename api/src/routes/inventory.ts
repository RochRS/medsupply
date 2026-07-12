import { Hono } from "hono";

export const inventory = new Hono();

inventory.get("/", async (c) => {});

inventory.get("/", async (c) => {});

inventory.get("/{id}", async (c) => {});
