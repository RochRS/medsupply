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
    id: integer().primaryKey().generatedAlwaysAsIdentity({
      name: "users_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    name: varchar({ length: 255 }).notNull(),
    age: integer().notNull(),
    email: varchar({ length: 255 }).notNull(),
  },
  (table) => [unique("users_email_unique").on(table.email)],
);
