import { Hono } from "hono";
import {
  getUrgentItems,
  getNonUrgentItems,
  getItemsByStock,
  getAllItems,
  getPaginatedItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  listCategories,
} from "../services/items.service.js";
import { ERROR_CODE_MAP } from "../constants/http-status-codes.js";
import type { AppEnv } from "../types/hono.js";
import type { CreateItemInput, UpdateItemInput } from "../schemas/item.js";
import { requireRole } from "../middleware/auth.js";
import { ROLE_NAMES } from "../database/seed/seed-roles.js";

const CRITICAL_MAX = 5;
const LOW_MAX = 20;

export const items = new Hono<AppEnv>();

// Categories (must be before /:id)
items.get("/categories", async (c) => {
  try {
    const rows = await listCategories();
    return c.json({ categories: rows });
  } catch (error) {
    console.error("items GET /categories error:", error);
    return c.json(
      { message: "Could not load categories", error: "CATEGORIES_FETCH_FAILED" },
      ERROR_CODE_MAP.INTERNAL_SERVER_ERROR,
    );
  }
});

items.get("/", async (c) => {
  const search = c.req.query("search")?.trim();
  const status = c.req.query("status");
  const stockMax = c.req.query("stock_max");
  const isUrgent = c.req.query("isUrgent");
  const categoryIdRaw = c.req.query("categoryId");
  const pageRaw = c.req.query("page");
  const pageSizeRaw = c.req.query("pageSize");
  const categoryId = categoryIdRaw ? Number(categoryIdRaw) : undefined;

  try {
    if (isUrgent === "true") {
      const rows = await getUrgentItems(search);
      return c.json({ items: rows });
    }

    if (isUrgent === "false") {
      const rows = await getNonUrgentItems(search);
      return c.json({ items: rows });
    }

    if (status === "urgent") {
      const rows = await getUrgentItems(search);
      return c.json({ items: rows });
    }

    const threshold = stockMax
      ? Number(stockMax)
      : status === "critical"
        ? CRITICAL_MAX
        : status === "low"
          ? LOW_MAX
          : null;

    if (threshold !== null) {
      const list = await getItemsByStock(threshold);
      return c.json({ items: list });
    }

    if (pageRaw || pageSizeRaw) {
      const result = await getPaginatedItems({
        search,
        categoryId:
          categoryId && Number.isInteger(categoryId) ? categoryId : undefined,
        page: pageRaw ? Number(pageRaw) : 1,
        pageSize: pageSizeRaw ? Number(pageSizeRaw) : 12,
      });
      return c.json(result);
    }

    const result = await getAllItems(
      search,
      categoryId && Number.isInteger(categoryId) ? categoryId : undefined,
    );
    return c.json(result);
  } catch (error) {
    console.error("items GET / error:", error);
    return c.json(
      { message: "Could not load items", error: "ITEMS_FETCH_FAILED" },
      ERROR_CODE_MAP.INTERNAL_SERVER_ERROR,
    );
  }
});

items.post(
  "/",
  requireRole(ROLE_NAMES.ADMIN, ROLE_NAMES.APOTHEKER),
  async (c) => {
    const body = await c.req.json<CreateItemInput>();

    if (!body.itemName || body.remainingAmount == null) {
      return c.json(
        {
          message: "itemName and remainingAmount are required",
          error: "VALIDATION_ERROR",
        },
        ERROR_CODE_MAP.BAD_REQUEST,
      );
    }

    try {
      const created = await createItem(body);
      return c.json({ item: created }, 201);
    } catch (error) {
      console.error("items POST / error:", error);
      return c.json(
        { message: "Could not create item", error: "ITEM_CREATE_FAILED" },
        ERROR_CODE_MAP.INTERNAL_SERVER_ERROR,
      );
    }
  },
);

items.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));

  if (!Number.isInteger(id) || id < 1) {
    return c.json(
      { message: "Invalid item id", error: "INVALID_ID" },
      ERROR_CODE_MAP.BAD_REQUEST,
    );
  }

  try {
    const row = await getItemById(id);
    if (!row) {
      return c.json(
        { message: "Item not found", error: "NOT_FOUND" },
        ERROR_CODE_MAP.NOT_FOUND,
      );
    }
    return c.json({ item: row });
  } catch (error) {
    console.error("items GET /:id error:", error);
    return c.json(
      { message: "Could not load item", error: "ITEMS_FETCH_FAILED" },
      ERROR_CODE_MAP.INTERNAL_SERVER_ERROR,
    );
  }
});

items.patch(
  "/:id",
  requireRole(ROLE_NAMES.ADMIN, ROLE_NAMES.APOTHEKER),
  async (c) => {
    const id = Number(c.req.param("id"));
    if (!Number.isInteger(id) || id < 1) {
      return c.json(
        { message: "Invalid item id", error: "INVALID_ID" },
        ERROR_CODE_MAP.BAD_REQUEST,
      );
    }

    const body = await c.req.json<UpdateItemInput>();
    if (Object.keys(body).length === 0) {
      return c.json(
        { message: "No fields to update", error: "VALIDATION_ERROR" },
        ERROR_CODE_MAP.BAD_REQUEST,
      );
    }

    try {
      const updated = await updateItem(id, body);
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
  },
);

items.delete(
  "/:id",
  requireRole(ROLE_NAMES.ADMIN, ROLE_NAMES.APOTHEKER),
  async (c) => {
  const id = Number(c.req.param("id"));
  if (!Number.isInteger(id) || id < 1) {
    return c.json(
      { message: "Invalid item id", error: "INVALID_ID" },
      ERROR_CODE_MAP.BAD_REQUEST,
    );
  }

  try {
    const deleted = await deleteItem(id);
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
},
);
