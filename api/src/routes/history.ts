import { Hono } from "hono";
import { getAllHistory } from "../services/history.service.js";
import { ERROR_CODE_MAP } from "../constants/http-status-codes.js";
import type { AppEnv } from "../types/hono.js";
import type { HistoryType } from "../services/history.service.js";

export const history = new Hono<AppEnv>();

// GET /history — activity feed (via service)
history.get("/", async (c) => {
  const typeQuery = c.req.query("type"); // "request" | "delivery" | undefined
  const limitRaw = Number(c.req.query("limit") ?? 100);
  const limit = Number.isFinite(limitRaw)
    ? Math.min(Math.max(limitRaw, 1), 500)
    : 100;

  const type: HistoryType | undefined =
    typeQuery === "request" || typeQuery === "delivery" ? typeQuery : undefined;

  try {
    const result = await getAllHistory({ type, limit });
    return c.json(result);
  } catch (error) {
    console.error("history GET / error:", error);
    return c.json(
      { message: "Could not load history", error: "HISTORY_FETCH_FAILED" },
      ERROR_CODE_MAP.INTERNAL_SERVER_ERROR,
    );
  }
});
