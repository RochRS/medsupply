import { Hono } from "hono";

export const profiel = new Hono();

profiel.get("/get-user-info", async (c) => {
});