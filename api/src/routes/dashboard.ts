import { Hono } from "hono";
import {
  getSpoedItemsNames,
  getKritiekLaag,
  getTotalItemsList,
  sendSpoedaanvraagRequest,
} from "../services/dashboard.js";

export const dashboard = new Hono();

// ── Urgent Requests ────────────────────────────────
dashboard.post("/urgent-requests", async (c) => {
  try {
    const body = await c.req.json<{
      itemId: number;
      requestedAmount: number;
      requestBatchId?: number;
      userId?: number | null;
      departmentId?: number | null;
      requestDescriptionField?: string | null;
    }>();
    const result = await sendSpoedaanvraagRequest(body);
    return c.json(result, 201);
  } catch (error) {
    return c.json({ error: "Failed to create urgent request" }, 500);
  }
});

// ── Items ──────────────────────────────────────────
dashboard.get("/items", async (c) => {
  try {
    const result = await getTotalItemsList();
    return c.json(result);
  } catch (error) {
    return c.json({ error: "Failed to fetch items" }, 500);
  }
});

dashboard.get("/items/urgent", async (c) => {
  try {
    const result = await getSpoedItemsNames();
    return c.json(result);
  } catch (error) {
    return c.json({ error: "Failed to fetch urgent items" }, 500);
  }
});

dashboard.get("/items/critical", async (c) => {
  try {
    const limit = c.req.query("limit");
    const result = await getKritiekLaag(limit ? Number(limit) : 10);
    return c.json(result);
  } catch (error) {
    return c.json({ error: "Failed to fetch critical items" }, 500);
  }
});

// ── Notifications ──────────────────────────────────
dashboard.get("/notifications", async (c) => {
  return c.json({ message: "List all notifications" });
});

dashboard.get("/notifications/count", async (c) => {
  return c.json({ message: "Notification counts" });
});

dashboard.get("/notifications/urgent", async (c) => {
  return c.json({ message: "Urgent notifications" });
});
