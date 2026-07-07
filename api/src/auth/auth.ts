import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../database/database.js"; // your drizzle instance
import "dotenv/config";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: process.env.DATABASE_TYPE as any, // or "mysql", "sqlite"
  }),
});
