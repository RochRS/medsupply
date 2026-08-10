import { desc, eq } from "drizzle-orm";
import { db } from "../database/database.js";
import {
  request,
  items,
  requestDescription,
  user,
} from "../database/schemas/schema.js";
import type { CreateRequestInput } from "../schemas/request.js";
import { IS_URGENT, NOT_URGENT } from "../constants/magic-numbers.js";

export type RequestStatus = "open" | "approved" | "completed";

export type RequestListRow = {
  requestId: number;
  requestBatchId: number;
  requestedAmount: number;
  isUrgent: boolean;
  status: RequestStatus;
  isCompleted: boolean;
  itemId: number | null;
  itemName: string | null;
  stockAmount: number | null;
  stockSufficient: boolean;
  stockShortfall: number;
  requestDescription: string | null;
  requesterId: string | null;
  requesterName: string | null;
  requesterEmail: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

function normalizeStatus(
  status: string | null | undefined,
  isCompleted: boolean,
): RequestStatus {
  if (isCompleted || status === "completed") return "completed";
  if (status === "approved") return "approved";
  return "open";
}

function mapRow(row: {
  requestId: number;
  requestBatchId: number;
  requestedAmount: number;
  isUrgent: boolean;
  status: string | null;
  isCompleted: boolean;
  itemId: number | null;
  itemName: string | null;
  stockAmount: number | null;
  requestDescription: string | null;
  requesterId: string | null;
  requesterName: string | null;
  requesterEmail: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}): RequestListRow {
  const status = normalizeStatus(row.status, row.isCompleted);
  const stockAmount = row.stockAmount ?? 0;
  const needsStock = status === "open";
  const shortfall = needsStock
    ? Math.max(0, row.requestedAmount - stockAmount)
    : 0;

  return {
    requestId: row.requestId,
    requestBatchId: row.requestBatchId,
    requestedAmount: row.requestedAmount,
    isUrgent: row.isUrgent,
    status,
    isCompleted: status === "completed",
    itemId: row.itemId,
    itemName: row.itemName,
    stockAmount: row.stockAmount,
    stockSufficient: !needsStock || stockAmount >= row.requestedAmount,
    stockShortfall: shortfall,
    requestDescription: row.requestDescription,
    requesterId: row.requesterId,
    requesterName: row.requesterName,
    requesterEmail: row.requesterEmail,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

const requestSelect = {
  requestId: request.requestId,
  requestBatchId: request.requestBatchId,
  requestedAmount: request.requestedAmount,
  isUrgent: request.isUrgent,
  status: request.status,
  isCompleted: request.isCompleted,
  itemId: request.itemId,
  itemName: items.itemName,
  stockAmount: items.remainingAmount,
  requestDescription: requestDescription.requestDescriptionField,
  requesterId: request.userId,
  requesterName: user.name,
  requesterEmail: user.email,
  createdAt: request.createdAt,
  updatedAt: request.updatedAt,
};

// ---- queries ----

export async function getAllRequests() {
  const rows = await db
    .select(requestSelect)
    .from(request)
    .leftJoin(items, eq(request.itemId, items.itemId))
    .leftJoin(
      requestDescription,
      eq(request.requestDescriptionId, requestDescription.requestDescriptionId),
    )
    .leftJoin(user, eq(request.userId, user.id))
    .orderBy(desc(request.isUrgent), desc(request.createdAt));

  return rows.map(mapRow);
}

/** Only requests created by this auth user (verpleging: own list). */
export async function getRequestsForUser(userId: string) {
  const rows = await db
    .select(requestSelect)
    .from(request)
    .leftJoin(items, eq(request.itemId, items.itemId))
    .leftJoin(
      requestDescription,
      eq(request.requestDescriptionId, requestDescription.requestDescriptionId),
    )
    .leftJoin(user, eq(request.userId, user.id))
    .where(eq(request.userId, userId))
    .orderBy(desc(request.createdAt));

  return rows.map(mapRow);
}

export async function getRequestById(id: number) {
  const [row] = await db
    .select(requestSelect)
    .from(request)
    .leftJoin(items, eq(request.itemId, items.itemId))
    .leftJoin(
      requestDescription,
      eq(request.requestDescriptionId, requestDescription.requestDescriptionId),
    )
    .leftJoin(user, eq(request.userId, user.id))
    .where(eq(request.requestId, id))
    .limit(1);

  return row ? mapRow(row) : null;
}

// ---- mutations ----

async function insertRequest(data: CreateRequestInput, isUrgentValue: boolean) {
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
      isUrgent: isUrgentValue,
      status: "open",
      isCompleted: false,
      itemId: data.itemId,
      userId: data.userId ?? null,
      departmentId: data.departmentId ?? null,
      requestDescriptionId: descriptionId,
    })
    .returning();

  return newRequest;
}

export async function sendUrgentRequest(data: CreateRequestInput) {
  return insertRequest(data, IS_URGENT);
}

export async function createRequest(data: CreateRequestInput) {
  return insertRequest(data, NOT_URGENT);
}

/**
 * Goedkeuren: reserveer/trek voorraad af en markeer als klaargezet voor de aanvrager.
 */
export async function approveRequest(id: number) {
  await db.transaction(async (tx) => {
    const [row] = await tx
      .select({
        requestId: request.requestId,
        itemId: request.itemId,
        requestedAmount: request.requestedAmount,
        status: request.status,
        isCompleted: request.isCompleted,
        stockAmount: items.remainingAmount,
      })
      .from(request)
      .leftJoin(items, eq(request.itemId, items.itemId))
      .where(eq(request.requestId, id))
      .limit(1);

    if (!row) {
      throw new Error("Aanvraag niet gevonden");
    }

    const status = normalizeStatus(row.status, row.isCompleted);
    if (status === "completed") {
      throw new Error("Aanvraag is al afgehandeld");
    }
    if (status === "approved") {
      throw new Error("Aanvraag is al goedgekeurd en klaargezet");
    }
    if (row.itemId == null) {
      throw new Error("Aanvraag heeft geen gekoppeld product");
    }

    const stock = row.stockAmount ?? 0;
    if (stock < row.requestedAmount) {
      const shortfall = row.requestedAmount - stock;
      throw new Error(
        `Niet genoeg op voorraad: ${stock} beschikbaar, ${row.requestedAmount} gevraagd (tekort: ${shortfall}). Vul voorraad aan of bestel bij.`,
      );
    }

    await tx
      .update(items)
      .set({
        remainingAmount: stock - row.requestedAmount,
        updatedAt: new Date(),
      })
      .where(eq(items.itemId, row.itemId));

    await tx
      .update(request)
      .set({
        status: "approved",
        isCompleted: false,
        updatedAt: new Date(),
      })
      .where(eq(request.requestId, id));
  });

  return getRequestById(id);
}

/**
 * Afhandelen: bevestig ophaling (alleen na goedkeuren).
 */
export async function completeRequest(id: number) {
  const current = await getRequestById(id);
  if (!current) {
    throw new Error("Aanvraag niet gevonden");
  }
  if (current.status === "completed") {
    throw new Error("Aanvraag is al afgehandeld");
  }
  if (current.status !== "approved") {
    throw new Error(
      "Keur de aanvraag eerst goed en zet klaar voordat je ophalen bevestigt",
    );
  }

  await db
    .update(request)
    .set({
      status: "completed",
      isCompleted: true,
      updatedAt: new Date(),
    })
    .where(eq(request.requestId, id));

  return getRequestById(id);
}

/** @deprecated Prefer approveRequest / completeRequest */
export async function markRequestCompleted(id: number, isCompleted = true) {
  if (!isCompleted) {
    await db
      .update(request)
      .set({ status: "open", isCompleted: false, updatedAt: new Date() })
      .where(eq(request.requestId, id));
    return getRequestById(id);
  }
  return completeRequest(id);
}
