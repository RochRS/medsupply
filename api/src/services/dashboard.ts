import { db } from "../database/database.js";
import { items, categories, request, requestDescription } from "../database/schemas/schema.js";
import { eq, lte } from "drizzle-orm";

export async function getUrgentItems() {
  return db
    .select({
      itemId: items.itemId,
      itemName: items.itemName,
      remainingAmount: items.remainingAmount,
    })
    .from(items)
    .innerJoin(request, eq(request.itemId, items.itemId))
    .where(eq(request.isUrgent, true));
}

export async function getCriticalLowStock(threshold = 10) {
  return db
    .select()
    .from(items)
    .where(lte(items.remainingAmount, threshold))
    .orderBy(items.remainingAmount);
}

export async function getAllItems() {
  return db
    .select()
    .from(items)
    .leftJoin(categories, eq(items.categoryId, categories.categoryId));
}

export async function sendUrgentRequest(data: {
  itemId: number;
  requestedAmount: number;
  requestBatchId?: number;
  userId?: string | null;
  departmentId?: number | null;
  requestDescriptionField?: string | null;
}) {
  let descriptionId: number | null = null;

  if (data.requestDescriptionField) {
    const [desc] = await db
      .insert(requestDescription)
      .values({ requestDescriptionField: data.requestDescriptionField })
      .returning({ requestDescriptionId: requestDescription.requestDescriptionId });
    descriptionId = desc.requestDescriptionId;
  }

  const [newRequest] = await db
    .insert(request)
    .values({
      requestBatchId: data.requestBatchId ?? Date.now(),
      requestedAmount: data.requestedAmount,
      isUrgent: true,
      isCompleted: false,
      itemId: data.itemId,
      userId: data.userId ?? null,
      departmentId: data.departmentId ?? null,
      requestDescriptionId: descriptionId,
    })
    .returning();

  return newRequest;
}
