import {
  integer,
  varchar,
  timestamp,
  boolean,
  pgTable,
  unique,
  text,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const items = pgTable("items", {
  itemId: integer().primaryKey().generatedAlwaysAsIdentity(),
  itemName: varchar({ length: 255 }).notNull(),
  description: text(),
  remainingAmount: integer().notNull(),
  createdAt: timestamp(),
  updatedAt: timestamp(),
  //external link
  categoryId: integer().references(() => categories.categoryId),
});

export const categories = pgTable("categories", {
  categoryId: integer().primaryKey().generatedAlwaysAsIdentity(),
  categoryName: varchar({ length: 255 }).notNull(),
  categoryDescription: text(),
  createdAt: timestamp().defaultNow().notNull(),
  updateAt: timestamp(),
});

export const request = pgTable("request", {
  requestId: integer().primaryKey().generatedAlwaysAsIdentity(),
  requestBatchId: integer().notNull(),
  requestedAmount: integer().notNull(),
  isUrgent: boolean().notNull(),
  isCompleted: boolean().notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
  //external link
  itemId: integer().references(() => items.itemId),
  userId: integer(), // TODO: .references(() => user.id) — link to Better Auth's user table?
  departmentId: integer(), // TODO: .references(() => departments.departmentId) — departments table not yet defined
  requestDescriptionId: integer().references(
    () => requestDescription.requestDescriptionId,
  ),
});

export const shipments = pgTable("shipments", {
  shipmentId: integer().primaryKey().generatedAlwaysAsIdentity(),
  shipmentBatchId: integer().notNull(),
  GTIN: integer().default(0),
  experationDate: timestamp().notNull(),
  cost: integer().notNull(),
  deliveryDate: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
  //external links
  itemId: integer().references(() => items.itemId),
  suppliersId: integer().references(() => suppliers.supplierId),
});

export const suppliers = pgTable("suppliers", {
  supplierId: integer().primaryKey().generatedAlwaysAsIdentity(),
  supplierName: varchar().notNull(),
  address: varchar(),
  description: text(),
  contactInfo: varchar(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});

export const requestDescription = pgTable("request_description", {
  requestDescriptionId: integer().primaryKey().generatedAlwaysAsIdentity(),
  requestDescriptionField: text(),
});

// ─── Relations ───────────────────────────────

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
  // user: one(user, {
  //   fields: [request.userId],
  //   references: [user.id],
  // }),
  // department: one(departments, {
  //   fields: [request.departmentId],
  //   references: [departments.departmentId],
  // }),
  description: one(requestDescription, {
    fields: [request.requestDescriptionId],
    references: [requestDescription.requestDescriptionId],
  }),
}));

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

export const requestDescriptionRelations = relations(
  requestDescription,
  ({ many }) => ({
    requests: many(request),
  }),
);
