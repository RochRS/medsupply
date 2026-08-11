import { Hono } from "hono";
import type { AppEnv } from "../types/hono.js";

export const settings = new Hono<AppEnv>();

settings.get("/", (c) => c.json({ message: "List all settings" }));
