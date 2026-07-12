import { Hono } from "hono";

export const requests = new Hono();

requests.post("/", async (c) => {});

requests.get("/", async (c) => {});
