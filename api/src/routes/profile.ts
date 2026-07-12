import { Hono } from "hono";

export const profile = new Hono();

profile.get("/", async (c) => {});
