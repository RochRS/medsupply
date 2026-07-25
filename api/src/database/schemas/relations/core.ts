import { relations } from "drizzle-orm";
import {
  categories,
  items,
  request,
  requestDescription,
  shipments,
  suppliers,
} from "../core.js";

export const itemsRelations = relations(items, ({ one, many }) => ({
  category: one(categories, {
    fields: [items.categoryId],
    references: [categories.categoryId],
  }),
  requests: many(request),
  shipments: many(shipments),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  items: many(items),
}));

export const requestRelations = relations(request, ({ one }) => ({
  item: one(items, {
    fields: [request.itemId],
    references: [items.itemId],
  }),
  description: one(requestDescription, {
    fields: [request.requestDescriptionId],
    references: [requestDescription.requestDescriptionId],
  }),
}));

export const requestDescriptionRelations = relations(
  requestDescription,
  ({ many }) => ({
    requests: many(request),
  }),
);

export const shipmentsRelations = relations(shipments, ({ one }) => ({
  item: one(items, {
    fields: [shipments.itemId],
    references: [items.itemId],
  }),
  supplier: one(suppliers, {
    fields: [shipments.suppliersId],
    references: [suppliers.supplierId],
  }),
}));

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  shipments: many(shipments),
}));
