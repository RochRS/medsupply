import { db } from "../database/database.js";
import { request, items, shipments, suppliers } from "../database/schemas/core.js";
import { desc, eq } from "drizzle-orm";

export type HistoryType = "request" | "delivery";

export type HistoryActivity = {
  id: string;
  type: HistoryType;
  itemName: string | null;
  amount: number;
  isUrgent: boolean | null;
  isCompleted: boolean | null;
  supplierName: string | null;
  createdAt: Date | null;
  status: string;
};

// Fetch requests + deliveries as one history list
export async function getAllHistory(options?: {
  type?: HistoryType;
  limit?: number;
}) {
  const type = options?.type;
  const limit = options?.limit ?? 100;
  const activities: HistoryActivity[] = [];

  // Map requests to history rows
  if (!type || type === "request") {
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
        id: `request-${row.requestId}`,
        type: "request",
        itemName: row.itemName,
        amount: row.requestedAmount,
        isUrgent: row.isUrgent,
        isCompleted: row.isCompleted,
        supplierName: null,
        createdAt: row.createdAt,
        status: row.isCompleted ? "completed" : row.isUrgent ? "urgent" : "open",
      });
    }
  }

  // Map shipments to delivery rows
  if (!type || type === "delivery") {
    const deliveries = await db
      .select({
        shipmentId: shipments.shipmentId,
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
        id: `delivery-${row.shipmentId}`,
        type: "delivery",
        itemName: row.itemName,
        amount: row.cost,
        isUrgent: null,
        isCompleted: true,
        supplierName: row.supplierName,
        createdAt: row.deliveryDate,
        status: "completed",
      });
    }
  }

  // Newest first
  activities.sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });

  const sliced = activities.slice(0, limit);

  return {
    activities: sliced,
    summary: {
      total: sliced.length,
      requests: sliced.filter((a) => a.type === "request").length,
      deliveries: sliced.filter((a) => a.type === "delivery").length,
    },
  };
}
