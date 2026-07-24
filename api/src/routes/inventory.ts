import { Hono } from "hono";
import { eq, asc, ilike, or } from "drizzle-orm";
import { db } from "../database/database.js";
import { items, categories } from "../database/schemas/core.js";
import { ERROR_CODE_MAP } from "../constants/http-status-codes.js";
import type { AppEnv } from "../types/hono.js";

// Stock level thresholds for the UI badges
const CRITICAL_MAX = 5;
const LOW_MAX = 20;

function stockLevel(amount: number): "kritiek" | "laag" | "goed" {
  if (amount <= CRITICAL_MAX) return "kritiek";
  if (amount <= LOW_MAX) return "laag";
  return "goed";
}

export const inventory = new Hono<AppEnv>();

// GET /api/inventory — list items + summary (totale voorraad)
inventory.get("/", async (c) => {
  const search = c.req.query("search")?.trim();

  try {
    const rows = await db
      .select({
        itemId: items.itemId,
        itemName: items.itemName,
        description: items.description,
        remainingAmount: items.remainingAmount,
        categoryId: items.categoryId,
        categoryName: categories.categoryName,
        createdAt: items.createdAt,
        updatedAt: items.updatedAt,
      })
      .from(items)
      .leftJoin(categories, eq(items.categoryId, categories.categoryId))
      .where(
        search
          ? or(
              ilike(items.itemName, `%${search}%`),
              ilike(categories.categoryName, `%${search}%`),
            )
          : undefined,
      )
      .orderBy(asc(items.itemName));

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
      summary: {
        totalItems,
        totalStock,
        criticalStock,
        lowStock,
      },
    });
  } catch (error) {
    console.error("inventory GET / error:", error);
    return c.json(
      { message: "Could not load inventory", error: "INVENTORY_FETCH_FAILED" },
      ERROR_CODE_MAP.INTERNAL_SERVER_ERROR,
    );
  }
});

// GET /api/inventory/:id — one item
inventory.get("/:id", async (c) => {
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
        itemId: items.itemId,
        itemName: items.itemName,
        description: items.description,
        remainingAmount: items.remainingAmount,
        categoryId: items.categoryId,
        categoryName: categories.categoryName,
        createdAt: items.createdAt,
        updatedAt: items.updatedAt,
      })
      .from(items)
      .leftJoin(categories, eq(items.categoryId, categories.categoryId))
      .where(eq(items.itemId, id))
      .limit(1);

    if (!row) {
      return c.json(
        { message: "Item not found", error: "NOT_FOUND" },
        ERROR_CODE_MAP.NOT_FOUND,
      );
    }

    return c.json({
      item: {
        ...row,
        stockLevel: stockLevel(row.remainingAmount),
      },
    });
  } catch (error) {
    console.error("inventory GET /:id error:", error);
    return c.json(
      { message: "Could not load item", error: "INVENTORY_FETCH_FAILED" },
      ERROR_CODE_MAP.INTERNAL_SERVER_ERROR,
    );
  }
});

