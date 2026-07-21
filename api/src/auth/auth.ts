import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import "dotenv/config";
import { db } from "../database/database.js";
import * as schema from "../database/schemas/schema.js";

// Allow cookies/CORS only from our frontend
const frontendOrigin =
  process.env.FRONTEND_URL?.replace(/\/$/, "") || "http://localhost:5173";

// Main auth setup: login, signup, sessions (stored in PostgreSQL)
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    // Use our Drizzle tables (user/session/account/verification)
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [frontendOrigin],
  // Email + password login for RKZ staff
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // session lasts 7 days
    updateAge: 60 * 60 * 24, // refresh cookie once per day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // cache session check for 5 minutes
    },
  },
});

// Handy types for middleware and routes
export type Session = typeof auth.$Infer.Session;
export type AuthUser = Session["user"];
export type AuthSession = Session["session"];
