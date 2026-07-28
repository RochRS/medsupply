import { db } from "../database/database.js";
import {
  items as itemsTable,
  categories,
  request,
} from "../database/schemas/schema.js";
import { eq, asc, ilike, or, lte, and, not, exists } from "drizzle-orm";
import type { CreateItemInput, UpdateItemInput } from "../schemas/item.js";

const CRITICAL_MAX = 5;
const LOW_MAX = 20;

export function stockLevel(amount: number): "critical" | "low" | "ok" {
  if (amount <= CRITICAL_MAX) return "critical";
  if (amount <= LOW_MAX) return "low";
  return "ok";
}

export async function getUrgentItems(search?: string) {
  return db
    .select({
      itemId: itemsTable.itemId,
      itemName: itemsTable.itemName,
      remainingAmount: itemsTable.remainingAmount,
    })
    .from(itemsTable)
    .where(
      and(
        search ? ilike(itemsTable.itemName, `%${search}%`) : undefined,
        exists(
          db
            .select({ id: request.requestId })
            .from(request)
            .where(
              and(
                eq(request.itemId, itemsTable.itemId),
                eq(request.isUrgent, true),
              ),
            ),
        ),
      ),
    );
}

export async function getNonUrgentItems(search?: string) {
  return db
    .select({
      itemId: itemsTable.itemId,
      itemName: itemsTable.itemName,
      remainingAmount: itemsTable.remainingAmount,
    })
    .from(itemsTable)
    .where(
      and(
        search ? ilike(itemsTable.itemName, `%${search}%`) : undefined,
        not(
          exists(
            db
              .select({ id: request.requestId })
              .from(request)
              .where(
                and(
                  eq(request.itemId, itemsTable.itemId),
                  eq(request.isUrgent, true),
                ),
              ),
          ),
        ),
      ),
    );
}

export async function getItemsByStock(threshold: number) {
  const rows = await db
    .select()
    .from(itemsTable)
    .where(lte(itemsTable.remainingAmount, threshold))
    .orderBy(asc(itemsTable.remainingAmount));

  return rows.map((row) => ({
    ...row,
    stockLevel: stockLevel(row.remainingAmount),
  }));
}

export async function getAllItems(search?: string) {
  const rows = await db
    .select({
      itemId: itemsTable.itemId,
      itemName: itemsTable.itemName,
      description: itemsTable.description,
      remainingAmount: itemsTable.remainingAmount,
      categoryId: itemsTable.categoryId,
      categoryName: categories.categoryName,
      createdAt: itemsTable.createdAt,
      updatedAt: itemsTable.updatedAt,
    })
    .from(itemsTable)
    .leftJoin(categories, eq(itemsTable.categoryId, categories.categoryId))
    .where(
      search
        ? or(
            ilike(itemsTable.itemName, `%${search}%`),
            ilike(categories.categoryName, `%${search}%`),
          )
        : undefined,
    )
    .orderBy(asc(itemsTable.itemName));

  const list = rows.map((row) => ({
    ...row,
    stockLevel: stockLevel(row.remainingAmount),
  }));

  const totalItems = list.length;
  const totalStock = list.reduce((sum, row) => sum + row.remainingAmount, 0);
  const criticalStock = list.filter(
    (row) => row.stockLevel === "critical",
  ).length;
  const lowStock = list.filter((row) => row.stockLevel === "low").length;

  return {
    items: list,
    summary: { totalItems, totalStock, criticalStock, lowStock },
  };
}

export async function getItemById(id: number) {
  const [row] = await db
    .select({
      itemId: itemsTable.itemId,
      itemName: itemsTable.itemName,
      description: itemsTable.description,
      remainingAmount: itemsTable.remainingAmount,
      categoryId: itemsTable.categoryId,
      categoryName: categories.categoryName,
      createdAt: itemsTable.createdAt,
      updatedAt: itemsTable.updatedAt,
    })
    .from(itemsTable)
    .leftJoin(categories, eq(itemsTable.categoryId, categories.categoryId))
    .where(eq(itemsTable.itemId, id))
    .limit(1);

  if (!row) return null;

  return { ...row, stockLevel: stockLevel(row.remainingAmount) };
}

export async function createItem(data: CreateItemInput) {
  const [created] = await db.insert(itemsTable).values(data).returning();

  return created;
}

export async function updateItem(id: number, data: UpdateItemInput) {
  const [updated] = await db
    .update(itemsTable)
    .set(data)
    .where(eq(itemsTable.itemId, id))
    .returning();

  return updated ?? null;
}

export async function deleteItem(id: number) {
  const [deleted] = await db
    .delete(itemsTable)
    .where(eq(itemsTable.itemId, id))
    .returning();

  return deleted ?? null;
}
