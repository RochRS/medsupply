import { createMiddleware } from "hono/factory";
import type { z } from "zod";
import type { AppEnv } from "../types/hono.js";
import { ERROR_CODE_MAP } from "../constants/http-status-codes.js";
import { sanitizeDeep } from "../lib/sanitize.js";

type Source = "json" | "query" | "param";

// Clean input, then check it with a Zod schema
// On success: save result in c.get("validated")
export const validate = <T extends z.ZodType>(
  schema: T,
  source: Source = "json",
) =>
  createMiddleware<AppEnv>(async (c, next) => {
    let raw: unknown;

    // Read body, query string, or URL params
    try {
      if (source === "json") {
        raw = await c.req.json();
      } else if (source === "query") {
        raw = c.req.query();
      } else {
        raw = c.req.param();
      }
    } catch {
      return c.json(
        { message: "Invalid request body", error: "INVALID_JSON" },
        ERROR_CODE_MAP.BAD_REQUEST,
      );
    }

    // 1) sanitize  2) validate
    const sanitized = sanitizeDeep(raw);
    const result = schema.safeParse(sanitized);

    if (!result.success) {
      return c.json(
        {
          message: "Validation failed",
          error: "VALIDATION_ERROR",
          issues: result.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        ERROR_CODE_MAP.BAD_REQUEST,
      );
    }

    c.set("validated", result.data);
    await next();
  });
