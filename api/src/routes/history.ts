import { Hono } from "hono";
import { getAllHistory } from "../services/history.service.js";
import { ERROR_CODE_MAP } from "../constants/http-status-codes.js";
import type { AppEnv } from "../types/hono.js";
import type { HistoryUrgency } from "../services/history.service.js";

export const history = new Hono<AppEnv>();

function parseDate(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

// GET /history — activity feed (via service)
history.get("/", async (c) => {
  const urgencyQuery = c.req.query("urgency");
  const limitRaw = Number(c.req.query("limit") ?? 100);
  const limit = Number.isFinite(limitRaw)
    ? Math.min(Math.max(limitRaw, 1), 500)
    : 100;

  const urgency: HistoryUrgency | undefined =
    urgencyQuery === "regulier" || urgencyQuery === "spoed"
      ? urgencyQuery
      : undefined;

  const from = parseDate(c.req.query("from"));
  const to = parseDate(c.req.query("to"));

  try {
    const result = await getAllHistory({ urgency, from, to, limit });
    return c.json(result);
  } catch (error) {
    console.error("history GET / error:", error);
    return c.json(
      { message: "Could not load history", error: "HISTORY_FETCH_FAILED" },
      ERROR_CODE_MAP.INTERNAL_SERVER_ERROR,
    );
  }
});
