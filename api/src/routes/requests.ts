import { Hono } from "hono";
import {
  getAllRequests,
  getRequestById,
  sendUrgentRequest,
  createRequest,
} from "../services/requests.service.js";
import { ERROR_CODE_MAP } from "../constants/http-status-codes.js";
import type { CreateRequestInput } from "../schemas/request.js";
import type { AppEnv } from "../types/hono.js";

export const requests = new Hono<AppEnv>();

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
    const urgent = c.req.query("urgent");
    const body = await c.req.json<CreateRequestInput>();
    const sessionUser = c.get("user");

    const payload: CreateRequestInput = {
      ...body,
      userId: body.userId ?? sessionUser?.id ?? null,
    };

    if (urgent === "1") {
      const result = await sendUrgentRequest(payload);
      return c.json(result, 201);
    }

    const result = await createRequest(payload);
    return c.json(result, 201);
  } catch (error) {
    console.error("requests POST / error:", error);
    return c.json(
      { error: "Failed to create request" },
      ERROR_CODE_MAP.INTERNAL_SERVER_ERROR,
    );
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