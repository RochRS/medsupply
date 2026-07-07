import {
  integer,
  varchar,
  timestamp,
  boolean,
  pgTable,
  unique,
  text,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  categoryId: integer().primaryKey().generatedAlwaysAsIdentity(),
  categoryName: varchar({ length: 255 }).notNull(),
  categoryDescription: text(),

  createdAt: timestamp().defaultNow().notNull(),
  updateAt: timestamp(),
});

export const items = pgTable("items", {
  itemId: integer().primaryKey().generatedAlwaysAsIdentity(),
  itemName: varchar({ length: 255 }).notNull(),
  description: text(),
  remainingAmount: integer().notNull(),
  createdAt: timestamp(),
  updatedAt: timestamp(),

  //external link
  categoryId: integer(),
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
  itemId: integer(),
  userId: integer(),
  departmentId: integer(),
  requestDescriptionId: integer(),
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
  itemId: integer(),
  suppliersId: integer(),
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
