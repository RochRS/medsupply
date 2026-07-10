import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../database/database.js"; // your drizzle instance

import "dotenv/config";
import type { Context } from "hono";

type DatabaseType = "mysql" | "pg" | "sqlite";
// type DatabaseType = "mysql" | "pg" | "sqlite";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: process.env.DATABASE_TYPE as DatabaseType, // or "mysql", "sqlite"
  }),
  baseURL: process.env.BASE_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: { enabled: true },
});
