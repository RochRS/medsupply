import { Hono } from "hono";
import type { AppEnv } from "../types/hono.js";

export const statistics = new Hono<AppEnv>();

statistics.get("/", (c) => c.json({ message: "List all statistics" }));
