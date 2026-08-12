import { db } from "../database/database.js";
import {
  request,
  items,
  shipments,
  suppliers,
  user,
} from "../database/schemas/schema.js";
import { and, desc, eq, gte, lte, type SQL } from "drizzle-orm";

export type HistoryUrgency = "regulier" | "spoed";

export type HistoryActivity = {
  id: string;
  type: "request" | "delivery";
  itemName: string | null;
  amount: number;
  isUrgent: boolean | null;
  isCompleted: boolean | null;
  supplierName: string | null;
  personName: string | null;
  createdAt: Date | null;
  status: string;
};

function endOfDay(date: Date): Date {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
}

function countRequests(
  activities: HistoryActivity[],
  urgent: boolean,
): number {
  return activities.filter(
    (a) => a.type === "request" && a.isUrgent === urgent,
  ).length;
}

// Fetch requests + deliveries as one history list
export async function getAllHistory(options?: {
  urgency?: HistoryUrgency;
  from?: Date;
  to?: Date;
  limit?: number;
}) {
  const urgency = options?.urgency;
  const from = options?.from;
  const to = options?.to ? endOfDay(options.to) : undefined;
  const limit = options?.limit ?? 100;
  const activities: HistoryActivity[] = [];

  const requestConditions: SQL[] = [];
  if (urgency === "regulier") requestConditions.push(eq(request.isUrgent, false));
  if (urgency === "spoed") requestConditions.push(eq(request.isUrgent, true));
  if (from) requestConditions.push(gte(request.createdAt, from));
  if (to) requestConditions.push(lte(request.createdAt, to));

  const requests = await db
    .select({
      requestId: request.requestId,
      requestedAmount: request.requestedAmount,
      isUrgent: request.isUrgent,
      isCompleted: request.isCompleted,
      createdAt: request.createdAt,
      itemName: items.itemName,
      personName: user.name,
    })
    .from(request)
    .leftJoin(items, eq(request.itemId, items.itemId))
    .leftJoin(user, eq(request.userId, user.id))
    .where(requestConditions.length > 0 ? and(...requestConditions) : undefined)
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
      personName: row.personName,
      createdAt: row.createdAt,
      status: row.isCompleted ? "completed" : row.isUrgent ? "urgent" : "open",
    });
  }

  // Deliveries only when not filtering by urgency
  if (!urgency) {
    const deliveryConditions: SQL[] = [];
    if (from) deliveryConditions.push(gte(shipments.deliveryDate, from));
    if (to) deliveryConditions.push(lte(shipments.deliveryDate, to));

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
      .where(
        deliveryConditions.length > 0 ? and(...deliveryConditions) : undefined,
      )
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
        personName: null,
        createdAt: row.deliveryDate,
        status: "completed",
      });
    }
  }

  activities.sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });

  const sliced = activities.slice(0, limit);

  const regulier = countRequests(sliced, false);
  const spoed = countRequests(sliced, true);

  return {
    activities: sliced,
    summary: {
      total: sliced.length,
      regulier,
      spoed,
    },
  };
}
