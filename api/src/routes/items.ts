import { Hono } from "hono";
import { eq, asc, ilike, or, lte } from "drizzle-orm";
import { db } from "../database/database.js";
import { items as itemsTable, categories, request } from "../database/schemas/core.js";
import { ERROR_CODE_MAP } from "../constants/http-status-codes.js";
import type { AppEnv } from "../types/hono.js";

const CRITICAL_MAX = 5;
const LOW_MAX = 20;

function stockLevel(amount: number): "kritiek" | "laag" | "goed" {
  if (amount <= CRITICAL_MAX) return "kritiek";
  if (amount <= LOW_MAX) return "laag";
  return "goed";
}

export const items = new Hono<AppEnv>();

items.get("/", async (c) => {
  const search = c.req.query("search")?.trim();
  const status = c.req.query("status");
  const stockMax = c.req.query("stock_max");

  try {
    // ── status=urgent: items with urgent requests ──
    if (status === "urgent") {
      const rows = await db
        .select({
          itemId: itemsTable.itemId,
          itemName: itemsTable.itemName,
          remainingAmount: itemsTable.remainingAmount,
        })
        .from(itemsTable)
        .innerJoin(request, eq(request.itemId, itemsTable.itemId))
        .where(eq(request.isUrgent, true));

      return c.json({ items: rows });
    }

    // ── status=critical|low or stock_max=N: items below a stock threshold ──
    const threshold = stockMax
      ? Number(stockMax)
      : status === "critical"
        ? CRITICAL_MAX
        : status === "low"
          ? LOW_MAX
          : null;

    if (threshold !== null) {
      const rows = await db
        .select()
        .from(itemsTable)
        .where(lte(itemsTable.remainingAmount, threshold))
        .orderBy(asc(itemsTable.remainingAmount));

      const list = rows.map((row) => ({
        ...row,
        stockLevel: stockLevel(row.remainingAmount),
      }));

      return c.json({ items: list });
    }

    // ── default: full list with optional search ──
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
    const criticalStock = list.filter((row) => row.stockLevel === "kritiek").length;
    const lowStock = list.filter((row) => row.stockLevel === "laag").length;

    return c.json({
      items: list,
      summary: { totalItems, totalStock, criticalStock, lowStock },
    });
  } catch (error) {
    console.error("items GET / error:", error);
    return c.json(
      { message: "Could not load items", error: "INVENTORY_FETCH_FAILED" },
      ERROR_CODE_MAP.INTERNAL_SERVER_ERROR,
    );
  }
});

items.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));

  if (!Number.isInteger(id) || id < 1) {
    return c.json(
      { message: "Invalid item id", error: "INVALID_ID" },
      ERROR_CODE_MAP.BAD_REQUEST,
    );
  }

  try {
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

    if (!row) {
      return c.json(
        { message: "Item not found", error: "NOT_FOUND" },
        ERROR_CODE_MAP.NOT_FOUND,
      );
    }

    return c.json({
      item: { ...row, stockLevel: stockLevel(row.remainingAmount) },
    });
  } catch (error) {
    console.error("items GET /:id error:", error);
    return c.json(
      { message: "Could not load item", error: "INVENTORY_FETCH_FAILED" },
      ERROR_CODE_MAP.INTERNAL_SERVER_ERROR,
    );
  }
});

items.post("/", async (c) => {
  const body = await c.req.json<{
    itemName: string;
    description?: string;
    remainingAmount: number;
    categoryId?: number;
  }>();

  if (!body.itemName || body.remainingAmount == null) {
    return c.json(
      { message: "itemName and remainingAmount are required", error: "VALIDATION_ERROR" },
      ERROR_CODE_MAP.BAD_REQUEST,
    );
  }

  try {
    const [created] = await db
      .insert(itemsTable)
      .values({
        itemName: body.itemName,
        description: body.description,
        remainingAmount: body.remainingAmount,
        categoryId: body.categoryId,
      })
      .returning();

    return c.json({ item: created }, 201);
  } catch (error) {
    console.error("items POST / error:", error);
    return c.json(
      { message: "Could not create item", error: "ITEM_CREATE_FAILED" },
      ERROR_CODE_MAP.INTERNAL_SERVER_ERROR,
    );
  }
});

items.patch("/:id", async (c) => {
  const id = Number(c.req.param("id"));

  if (!Number.isInteger(id) || id < 1) {
    return c.json(
      { message: "Invalid item id", error: "INVALID_ID" },
      ERROR_CODE_MAP.BAD_REQUEST,
    );
  }

  const body = await c.req.json<{
    itemName?: string;
    description?: string;
    remainingAmount?: number;
    categoryId?: number;
  }>();

  if (Object.keys(body).length === 0) {
    return c.json(
      { message: "No fields to update", error: "VALIDATION_ERROR" },
      ERROR_CODE_MAP.BAD_REQUEST,
    );
  }

  try {
    const [updated] = await db
      .update(itemsTable)
      .set(body)
      .where(eq(itemsTable.itemId, id))
      .returning();

    if (!updated) {
      return c.json(
        { message: "Item not found", error: "NOT_FOUND" },
        ERROR_CODE_MAP.NOT_FOUND,
      );
    }

    return c.json({ item: updated });
  } catch (error) {
    console.error("items PATCH /:id error:", error);
    return c.json(
      { message: "Could not update item", error: "ITEM_UPDATE_FAILED" },
      ERROR_CODE_MAP.INTERNAL_SERVER_ERROR,
    );
  }
});

items.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));

  if (!Number.isInteger(id) || id < 1) {
    return c.json(
      { message: "Invalid item id", error: "INVALID_ID" },
      ERROR_CODE_MAP.BAD_REQUEST,
    );
  }

  try {
    const [deleted] = await db
      .delete(itemsTable)
      .where(eq(itemsTable.itemId, id))
      .returning();

    if (!deleted) {
      return c.json(
        { message: "Item not found", error: "NOT_FOUND" },
        ERROR_CODE_MAP.NOT_FOUND,
      );
    }

    return c.json({ message: "Item deleted" }, 200);
  } catch (error) {
    console.error("items DELETE /:id error:", error);
    return c.json(
      { message: "Could not delete item", error: "ITEM_DELETE_FAILED" },
      ERROR_CODE_MAP.INTERNAL_SERVER_ERROR,
    );
  }
});
