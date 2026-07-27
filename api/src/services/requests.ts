import { db } from "../database/database.js";
import { request, items } from "../database/schemas/schema.js";
import { eq, desc } from "drizzle-orm";

export async function getAllRequests() {
  return db
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
}

export async function getRequestById(id: number) {
  const [row] = await db
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
    .where(eq(request.requestId, id))
    .limit(1);

  return row ?? null;
}