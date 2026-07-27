import { Hono } from "hono";
import { getAllRequests, getRequestById, sendUrgentRequest } from "../services/requests.service.js";
import { ERROR_CODE_MAP } from "../constants/http-status-codes.js";

export const requests = new Hono();

// ---- GET / POST (collection) ----

requests.get("/", async (c) => {
  try {
    const rows = await getAllRequests();
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
      userId?: string | null;
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
  const id = Number(c.req.param("id"));

  try {
    const row = await getRequestById(id);

    if (!row) {
      return c.json(
        { message: "Request not found", error: "REQUEST_NOT_FOUND" },
        ERROR_CODE_MAP.NOT_FOUND,
      );
    }

    return c.json({ request: row });
  } catch (error) {
    console.error("requests GET /:id error:", error);
    return c.json(
      { message: "Could not load request", error: "REQUEST_FETCH_FAILED" },
      ERROR_CODE_MAP.INTERNAL_SERVER_ERROR,
    );
  }
});

requests.patch("/:id", async (c) => {
  const id = c.req.param("id");
  return c.json({ message: `Update request ${id}` });
});

requests.delete("/:id", async (c) => {
  const id = c.req.param("id");
  return c.json({ message: `Delete request ${id}` });
});