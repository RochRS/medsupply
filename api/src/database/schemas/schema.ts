import {
  integer,
  varchar,
  timestamp,
  boolean,
  pgTable,
  unique,
  text,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

//Making other db schemas available
export * from "./auth-schema.js";
export * from "./core.js";

//Tables
export const users = pgTable(
  "users",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity({
      name: "users_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    name: varchar("name", { length: 255 }).notNull(),
    age: integer("age").notNull(),
    email: varchar("email", { length: 255 }).notNull(),
  },
  (table) => [unique("users_email_unique").on(table.email)],
);
