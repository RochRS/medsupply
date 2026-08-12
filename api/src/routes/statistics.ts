import { Hono } from "hono";
import { ERROR_CODE_MAP } from "../constants/http-status-codes.js";
import type { AppEnv } from "../types/hono.js";
import {
  getStatisticsOverview,
  type UsagePeriod,
} from "../services/statistics.service.js";

export const statistics = new Hono<AppEnv>();

statistics.get("/", async (c) => {
  const periodRaw = c.req.query("period");
  const period: UsagePeriod =
    periodRaw === "monthly" || periodRaw === "yearly" || periodRaw === "daily"
      ? periodRaw
      : "daily";

  try {
    const data = await getStatisticsOverview(period);
    return c.json(data);
  } catch (error) {
    console.error("statistics GET / error:", error);
    return c.json(
      {
        message: "Could not load statistics",
        error: "STATISTICS_FETCH_FAILED",
      },
      ERROR_CODE_MAP.INTERNAL_SERVER_ERROR,
    );
  }
});
