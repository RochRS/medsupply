import { Hono } from "hono";
import { sendUrgentRequest } from "../services/dashboard.js";
import { ERROR_CODE_MAP } from "../constants/http-status-codes.js";

export const requests = new Hono();

requests.get("/", async (c) => {
  return c.json({ message: "List all requests" });
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
