import { Hono } from "hono";

export const history = new Hono();

history.get("/", async (c) => {});
