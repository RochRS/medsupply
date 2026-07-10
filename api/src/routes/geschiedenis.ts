import { Hono } from "hono";

export const geschiedenis = new Hono();

geschiedenis.get("/get-geschiedenis-info", async (c) => {
});