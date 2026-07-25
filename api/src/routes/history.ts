import { Hono } from "hono";
import { desc, eq } from "drizzle-orm";
import { db } from "../database/database.js";
import { request, items, shipments, suppliers } from "../database/schemas/core.js";
import { ERROR_CODE_MAP } from "../constants/http-status-codes.js";
import type { AppEnv } from "../types/hono.js";

export const history = new Hono<AppEnv>();

// GET /api/history — activity feed (aanvragen + leveringen)
history.get("/", async (c) => {
  const type = c.req.query("type"); // "aanvraag" | "levering" | undefined = all
  const limitRaw = Number(c.req.query("limit") ?? 100);
  const limit = Number.isFinite(limitRaw)
    ? Math.min(Math.max(limitRaw, 1), 500)
    : 100;

  try {
    const activities: Array<{
      id: string;
      type: "aanvraag" | "levering";
      itemName: string | null;
      amount: number;
      isUrgent: boolean | null;
      isCompleted: boolean | null;
      supplierName: string | null;
      createdAt: Date | null;
      status: string;
    }> = [];

    // Requests (= aanvragen) as history rows
    if (!type || type === "aanvraag") {
      const requests = await db
        .select({
          requestId: request.requestId,
          requestedAmount: request.requestedAmount,
          isUrgent: request.isUrgent,
          isCompleted: request.isCompleted,
          createdAt: request.createdAt,
          itemName: items.itemName,
        })
        .from(request)
        .leftJoin(items, eq(request.itemId, items.itemId))
        .orderBy(desc(request.createdAt))
        .limit(limit);

      for (const row of requests) {
        activities.push({
          id: `aanvraag-${row.requestId}`,
          type: "aanvraag",
          itemName: row.itemName,
          amount: row.requestedAmount,
          isUrgent: row.isUrgent,
          isCompleted: row.isCompleted,
          supplierName: null,
          createdAt: row.createdAt,
          status: row.isCompleted
            ? "voltooid"
            : row.isUrgent
              ? "spoed"
              : "open",
        });
      }
    }

    // Shipments (= leveringen) as history rows
    if (!type || type === "levering") {
      const deliveries = await db
        .select({
          shipmentId: shipments.shipmentId,
          shipmentBatchId: shipments.shipmentBatchId,
          cost: shipments.cost,
          deliveryDate: shipments.deliveryDate,
          itemName: items.itemName,
          supplierName: suppliers.supplierName,
        })
        .from(shipments)
        .leftJoin(items, eq(shipments.itemId, items.itemId))
        .leftJoin(suppliers, eq(shipments.suppliersId, suppliers.supplierId))
        .orderBy(desc(shipments.deliveryDate))
        .limit(limit);

      for (const row of deliveries) {
        activities.push({
          id: `levering-${row.shipmentId}`,
          type: "levering",
          itemName: row.itemName,
          amount: row.cost,
          isUrgent: null,
          isCompleted: true,
          supplierName: row.supplierName,
          createdAt: row.deliveryDate,
          status: "voltooid",
        });
      }
    }

    // Newest first across both types
    activities.sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });

    const sliced = activities.slice(0, limit);

    return c.json({
      activities: sliced,
      summary: {
        total: sliced.length,
        aanvragen: sliced.filter((a) => a.type === "aanvraag").length,
        leveringen: sliced.filter((a) => a.type === "levering").length,
      },
    });
  } catch (error) {
    console.error("history GET / error:", error);
    return c.json(
      { message: "Could not load history", error: "HISTORY_FETCH_FAILED" },
      ERROR_CODE_MAP.INTERNAL_SERVER_ERROR,
    );
  }
});
