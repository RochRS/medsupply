import { Hono } from "hono";
import { eq, desc } from "drizzle-orm";
import { db } from "../database/database.js";
import { request, items } from "../database/schemas/core.js";
import { sendUrgentRequest } from "../services/dashboard.js";
import { ERROR_CODE_MAP } from "../constants/http-status-codes.js";

export const requests = new Hono();

// ---- GET / POST (collection) ----

requests.get("/", async (c) => {
  try {
    const rows = await db
      .select({
        requestId: request.requestId,
        requestBatchId: request.requestBatchId,
        requestedAmount: request.requestedAmount,
        isUrgent: request.isUrgent,
        isCompleted: request.isCompleted,
        itemName: items.itemName,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
      })
      .from(request)
      .leftJoin(items, eq(request.itemId, items.itemId))
      .orderBy(desc(request.createdAt));

    return c.json({ requests: rows });
  } catch (error) {
    console.error("requests GET / error:", error);
    return c.json(
      { message: "Could not load requests", error: "REQUESTS_FETCH_FAILED" },
      ERROR_CODE_MAP.INTERNAL_SERVER_ERROR,
    );
  }
});

requests.post("/", async (c) => {
  try {
    const body = await c.req.json<{
      itemId: number;
      requestedAmount: number;
      isUrgent?: boolean;
      requestBatchId?: number;
      userId?: number | null;
      departmentId?: number | null;
      requestDescriptionField?: string | null;
    }>();

    if (body.isUrgent) {
      const result = await sendUrgentRequest(body);
      return c.json(result, 201);
    }

    return c.json({ message: "Create a new request" }, 201);
  } catch (error) {
    return c.json({ error: "Failed to create request" }, ERROR_CODE_MAP.INTERNAL_SERVER_ERROR);
  }
});

// ---- GET /:id , PATCH /:id , DELETE /:id (single request) ----

requests.get("/:id", async (c) => {
  const id = c.req.param("id");
  return c.json({ message: `Get request ${id}` });
});

requests.patch("/:id", async (c) => {
  const id = c.req.param("id");
  return c.json({ message: `Update request ${id}` });
});

requests.delete("/:id", async (c) => {
  const id = c.req.param("id");
  return c.json({ message: `Delete request ${id}` });
});
