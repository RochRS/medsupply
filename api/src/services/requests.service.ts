import { db } from "../database/database.js";
import {
  request,
  items,
  requestDescription,
} from "../database/schemas/schema.js";
import { eq, desc } from "drizzle-orm";
import type { CreateRequestInput } from "../schemas/request.js";

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

export async function sendUrgentRequest(data: CreateRequestInput) {
  let descriptionId: number | null = null;

  if (data.requestDescriptionField) {
    const [desc] = await db
      .insert(requestDescription)
      .values({ requestDescriptionField: data.requestDescriptionField })
      .returning({
        requestDescriptionId: requestDescription.requestDescriptionId,
      });
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
