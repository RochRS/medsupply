import { db } from "../database/database.js";
import { items as itemsTable, categories, request } from "../database/schemas/schema.js";
import { eq, asc, ilike, or, lte, and, not, exists, count } from "drizzle-orm";
import type { CreateItemInput, UpdateItemInput } from "../schemas/item.js";

const CRITICAL_MAX = 5;
const LOW_MAX = 10;

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

export async function listCategories() {
  const [rows, counts] = await Promise.all([
    db
      .select({
        categoryId: categories.categoryId,
        categoryName: categories.categoryName,
        categoryDescription: categories.categoryDescription,
        icon: categories.icon,
      })
      .from(categories)
      .orderBy(asc(categories.categoryName)),
    db
      .select({
        categoryId: itemsTable.categoryId,
        itemCount: count(),
      })
      .from(itemsTable)
      .groupBy(itemsTable.categoryId),
  ]);

  const countMap = new Map(
    counts
      .filter((c) => c.categoryId != null)
      .map((c) => [c.categoryId as number, Number(c.itemCount)]),
  );

  return rows.map((row) => ({
    ...row,
    itemCount: countMap.get(row.categoryId) ?? 0,
  }));
}

function buildItemFilters(search?: string, categoryId?: number) {
  const conditions = [];
  if (search?.trim()) {
    const q = `%${search.trim()}%`;
    conditions.push(
      or(
        ilike(itemsTable.itemName, q),
        ilike(categories.categoryName, q),
        ilike(itemsTable.description, q),
      ),
    );
  }
  if (categoryId) {
    conditions.push(eq(itemsTable.categoryId, categoryId));
  }
  return conditions.length ? and(...conditions) : undefined;
}

export async function getAllItems(search?: string, categoryId?: number) {
  const rows = await db
    .select({
      itemId: itemsTable.itemId,
      itemName: itemsTable.itemName,
      description: itemsTable.description,
      remainingAmount: itemsTable.remainingAmount,
      categoryId: itemsTable.categoryId,
      categoryName: categories.categoryName,
      categoryIcon: categories.icon,
      createdAt: itemsTable.createdAt,
      updatedAt: itemsTable.updatedAt,
    })
    .from(itemsTable)
    .leftJoin(categories, eq(itemsTable.categoryId, categories.categoryId))
    .where(buildItemFilters(search, categoryId))
    .orderBy(asc(itemsTable.itemName));

  const list = rows.map((row) => ({
    ...row,
    stockLevel: stockLevel(row.remainingAmount),
  }));

  return {
    items: list,
    summary: {
      totalItems: list.length,
      totalStock: list.reduce((sum, row) => sum + row.remainingAmount, 0),
      criticalStock: list.filter((row) => row.stockLevel === "critical").length,
      lowStock: list.filter((row) => row.stockLevel === "low").length,
    },
  };
}

export async function getPaginatedItems(opts: {
  search?: string;
  categoryId?: number;
  page?: number;
  pageSize?: number;
}) {
  const page = Math.max(1, opts.page ?? 1);
  const pageSize = Math.min(48, Math.max(1, opts.pageSize ?? 12));
  const offset = (page - 1) * pageSize;
  const whereClause = buildItemFilters(opts.search, opts.categoryId);

  const [totalRow] = await db
    .select({ n: count() })
    .from(itemsTable)
    .leftJoin(categories, eq(itemsTable.categoryId, categories.categoryId))
    .where(whereClause);

  const rows = await db
    .select({
      itemId: itemsTable.itemId,
      itemName: itemsTable.itemName,
      description: itemsTable.description,
      remainingAmount: itemsTable.remainingAmount,
      categoryId: itemsTable.categoryId,
      categoryName: categories.categoryName,
      categoryIcon: categories.icon,
      createdAt: itemsTable.createdAt,
      updatedAt: itemsTable.updatedAt,
    })
    .from(itemsTable)
    .leftJoin(categories, eq(itemsTable.categoryId, categories.categoryId))
    .where(whereClause)
    .orderBy(asc(itemsTable.itemName))
    .limit(pageSize)
    .offset(offset);

  const list = rows.map((row) => ({
    ...row,
    stockLevel: stockLevel(row.remainingAmount),
  }));

  const summarySource = await getAllItems(opts.search, opts.categoryId);
  const total = Number(totalRow?.n ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);

  return {
    items: list,
    summary: summarySource.summary,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasMore: page < totalPages,
    },
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
      categoryIcon: categories.icon,
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
  const [created] = await db
    .insert(itemsTable)
    .values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  return created;
}

export async function updateItem(id: number, data: UpdateItemInput) {
  const [updated] = await db
    .update(itemsTable)
    .set({ ...data, updatedAt: new Date() })
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
