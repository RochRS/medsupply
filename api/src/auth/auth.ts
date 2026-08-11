import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import "dotenv/config";
import { db } from "../database/database.js";
import * as schema from "../database/schemas/schema.js";

/** Strip accidental quotes from Railway env values */
function cleanEnvUrl(value: string | undefined, fallback: string): string {
  const raw = (value ?? fallback).trim().replace(/^["']|["']$/g, "");
  return raw.replace(/\/$/, "") || fallback;
}

// Allow cookies/CORS only from our frontend
const frontendOrigin = cleanEnvUrl(
  process.env.FRONTEND_URL,
  "http://localhost:5173",
);

const authBaseURL = cleanEnvUrl(
  process.env.BETTER_AUTH_URL,
  "http://localhost:5000",
);

/** SPA and API on different hostnames (Railway web ≠ api) need cross-site cookies */
function needsCrossSiteCookies(): boolean {
  try {
    return new URL(frontendOrigin).origin !== new URL(authBaseURL).origin;
  } catch {
    return false;
  }
}

const crossSiteCookies = needsCrossSiteCookies();

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
  baseURL: authBaseURL,
  secret: process.env.BETTER_AUTH_SECRET?.replace(/^["']|["']$/g, ""),
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
  // Without SameSite=None, session cookies are not sent from
  // medsupply.up.railway.app → api-medsupply.up.railway.app (cross-site fetch).
  advanced: {
    defaultCookieAttributes: {
      sameSite: crossSiteCookies ? "none" : "lax",
      secure: crossSiteCookies || process.env.COOKIE_SECURE === "true",
      httpOnly: true,
      path: "/",
    },
  },
});

// Handy types for middleware and routes
export type Session = typeof auth.$Infer.Session;
export type AuthUser = Session["user"];
export type AuthSession = Session["session"];
