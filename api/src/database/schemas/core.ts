import {
  integer,
  varchar,
  timestamp,
  boolean,
  pgTable,
  unique,
  text,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema.js";

export const items = pgTable("items", {
  itemId: integer("item_id").primaryKey().generatedAlwaysAsIdentity(),
  itemName: varchar("item_name", { length: 255 }).notNull(),
  description: text("description"),
  remainingAmount: integer("remaining_amount").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
  //external link
  categoryId: integer("category_id").references(() => categories.categoryId),
});

export const categories = pgTable("categories", {
  categoryId: integer("category_id").primaryKey().generatedAlwaysAsIdentity(),
  categoryName: varchar("category_name", { length: 255 }).notNull(),
  categoryDescription: text("category_description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updateAt: timestamp("updated_at"),
});

export const request = pgTable("request", {
  requestId: integer("request_id").primaryKey().generatedAlwaysAsIdentity(),
  requestBatchId: integer("request_batch_id").notNull(),
  requestedAmount: integer("requested_amount").notNull(),
  isUrgent: boolean("is_urgent").notNull(),
  isCompleted: boolean("is_completed").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  //external link
  itemId: integer("item_id").references(() => items.itemId),
  userId: text("user_id").references(() => user.id),
  departmentId: integer("department_id"),
  requestDescriptionId: integer("request_description_id").references(
    () => requestDescription.requestDescriptionId,
  ),
});

export const shipments = pgTable("shipments", {
  shipmentId: integer("shipment_id").primaryKey().generatedAlwaysAsIdentity(),
  shipmentBatchId: integer("shipment_batch_id").notNull(),
  GTIN: integer("gtin").default(0),
  experationDate: timestamp("expiration_date").notNull(),
  cost: integer("cost").notNull(),
  deliveryDate: timestamp("delivery_date").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  //external links
  itemId: integer("item_id").references(() => items.itemId),
  suppliersId: integer("supplier_id").references(() => suppliers.supplierId),
});

export const suppliers = pgTable("suppliers", {
  supplierId: integer("supplier_id").primaryKey().generatedAlwaysAsIdentity(),
  supplierName: varchar("supplier_name").notNull(),
  address: varchar("address"),
  description: text("description"),
  contactInfo: varchar("contact_info"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const requestDescription = pgTable("request_description", {
  requestDescriptionId: integer("request_description_id").primaryKey().generatedAlwaysAsIdentity(),
  requestDescriptionField: text("request_description_field"),
});
