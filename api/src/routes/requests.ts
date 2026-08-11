import { Hono } from "hono";
import {
  getAllRequests,
  getRequestsForUser,
  getRequestById,
  sendUrgentRequest,
  createRequest,
  approveRequest,
  completeRequest,
} from "../services/requests.service.js";
import { ERROR_CODE_MAP } from "../constants/http-status-codes.js";
import type { CreateRequestInput } from "../schemas/request.js";
import type { AppEnv } from "../types/hono.js";
import { requireRole } from "../middleware/auth.js";
import { ROLE_NAMES } from "../database/seed/seed-roles.js";

export const requests = new Hono<AppEnv>();

function applyListFilters(
  rows: Awaited<ReturnType<typeof getAllRequests>>,
  opts: { urgent?: string; openOnly?: string; status?: string },
) {
  let next = rows;

  if (opts.urgent === "1" || opts.urgent === "true") {
    next = next.filter((r) => r.isUrgent);
  } else if (opts.urgent === "0" || opts.urgent === "false") {
    next = next.filter((r) => !r.isUrgent);
  }

  if (opts.status === "open") {
    next = next.filter((r) => r.status === "open");
  } else if (opts.status === "approved") {
    next = next.filter((r) => r.status === "approved");
  } else if (opts.status === "completed") {
    next = next.filter((r) => r.status === "completed");
  } else if (opts.openOnly === "1" || opts.openOnly === "true") {
    next = next.filter((r) => !r.isCompleted);
  }

  return next;
}

requests.get("/", async (c) => {
  try {
    const sessionUser = c.get("user");
    const role = c.get("role");
    const urgent = c.req.query("urgent");
    const openOnly = c.req.query("open");
    const status = c.req.query("status");
    const mine = c.req.query("mine");

    const roleName = role?.roleName ?? null;
    // Verpleging altijd alleen eigen aanvragen; optioneel ?mine=1 voor admin
    const ownOnly =
      roleName === ROLE_NAMES.VERPLEGING ||
      mine === "1" ||
      mine === "true";

    if (ownOnly && !sessionUser?.id) {
      return c.json(
        { message: "Unauthorized", error: "AUTHENTICATION_REQUIRED" },
        ERROR_CODE_MAP.UNAUTHORIZED,
      );
    }

    let rows = ownOnly
      ? await getRequestsForUser(sessionUser!.id)
      : await getAllRequests();

    rows = applyListFilters(rows, { urgent, openOnly, status });

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

    const sessionUser = c.get("user");
    const role = c.get("role");
    if (
      role?.roleName === ROLE_NAMES.VERPLEGING &&
      row.requesterId !== sessionUser?.id
    ) {
      return c.json(
        { message: "Forbidden", error: "REQUEST_FORBIDDEN" },
        ERROR_CODE_MAP.FORBIDDEN,
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

requests.patch(
  "/:id",
  requireRole(ROLE_NAMES.ADMIN, ROLE_NAMES.APOTHEKER),
  async (c) => {
    const id = Number(c.req.param("id"));
    if (!Number.isInteger(id) || id < 1) {
      return c.json(
        { message: "Invalid request id", error: "INVALID_ID" },
        ERROR_CODE_MAP.BAD_REQUEST,
      );
    }

    let body: {
      action?: string;
      status?: string;
      isCompleted?: boolean;
    };
    try {
      body = await c.req.json();
    } catch {
      return c.json(
        { message: "Ongeldige body", error: "VALIDATION_ERROR" },
        ERROR_CODE_MAP.BAD_REQUEST,
      );
    }

    const action =
      body.action === "approve" || body.status === "approved"
        ? "approve"
        : body.action === "complete" ||
            body.status === "completed" ||
            body.isCompleted === true
          ? "complete"
          : null;

    if (!action) {
      return c.json(
        {
          message:
            "Geef action: 'approve' of 'complete' (of status: 'approved' / 'completed')",
          error: "VALIDATION_ERROR",
        },
        ERROR_CODE_MAP.BAD_REQUEST,
      );
    }

    try {
      const updated =
        action === "approve"
          ? await approveRequest(id)
          : await completeRequest(id);

      if (!updated) {
        return c.json(
          { message: "Request not found", error: "REQUEST_NOT_FOUND" },
          ERROR_CODE_MAP.NOT_FOUND,
        );
      }
      return c.json({ request: updated });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not update request";
      const isClientError =
        message.includes("voorraad") ||
        message.includes("eerst") ||
        message.includes("al ") ||
        message.includes("niet gevonden") ||
        message.includes("geen gekoppeld");

      console.error("requests PATCH /:id error:", error);
      return c.json(
        {
          message,
          error: isClientError ? "REQUEST_UPDATE_REJECTED" : "REQUEST_UPDATE_FAILED",
        },
        isClientError
          ? ERROR_CODE_MAP.BAD_REQUEST
          : ERROR_CODE_MAP.INTERNAL_SERVER_ERROR,
      );
    }
  },
);

requests.delete("/:id", async (c) => {
  const id = c.req.param("id");
  return c.json({ message: `Delete request ${id}` });
});
