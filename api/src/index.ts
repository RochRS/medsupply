//DOT ENV
import "dotenv/config";

//Server Import
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

// Import database connection and test functions
import { testDbConnection, dizzleCheck } from "./database/database.js";

// Import route modules
import { settings } from "./routes/settings.js";
import { requests } from "./routes/requests.js";
import { items } from "./routes/items.js";
import { statistics } from "./routes/statistics.js";
import { history } from "./routes/history.js";
import { users } from "./routes/users.js";
import { notifications } from "./routes/notifications.js";
import { session } from "./routes/session.js";

// Auth
import { auth } from "./auth/auth.js";
import { loadSession, requireAuth } from "./middleware/auth.js";
import type { AppEnv } from "./types/hono.js";

//----------------------------------

/** Strip accidental quotes from Railway env values */
function cleanEnvUrl(value: string | undefined, fallback: string): string {
  const raw = (value ?? fallback).trim().replace(/^["']|["']$/g, "");
  return raw.replace(/\/$/, "") || fallback;
}

const frontendOrigin = cleanEnvUrl(
  process.env.FRONTEND_URL,
  "http://localhost:5173",
);

// Public root — Railway health check / browser open
const app = new Hono();
app.get("/", (c) => c.text("API running"));

// All API routes live under /api
const api = new Hono<AppEnv>().basePath("/api");

api.get("/", async (c) => {
  return c.json({
    name: "MedSupply API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      auth: "/api/auth/*",
      requests: "/api/requests",
      items: "/api/items",
      statistics: "/api/statistics",
      history: "/api/history",
      settings: "/api/settings",
      users: "/api/users",
      notifications: "/api/notifications",
      sessions: "/api/sessions",
    },
  });
});

// Allow the Vite frontend to call this API (with cookies)
api.use(
  "*",
  cors({
    origin: frontendOrigin,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

// better-auth handles login / signup / logout / session
// Use /auth/* (not /**) so nested paths like /auth/sign-in/email match under basePath /api
api.on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw));

// Load user/session on every request (may be null)
api.use("*", loadSession);

// Public session helpers (/sessions/me, /sessions/health)
api.route("/sessions", session);

// Public: app name is readable by anyone (e.g. the login screen);
// the route itself gates writes to admins via requireRole.
api.route("/settings", settings);

// Protected API routes (require a logged-in session)
const mountProtected = (path: string, route: Hono<AppEnv>) => {
  const secured = new Hono<AppEnv>();
  secured.use("*", requireAuth);
  secured.route("/", route);
  api.route(path, secured);
};

mountProtected("/requests", requests);
mountProtected("/items", items);
mountProtected("/statistics", statistics);
mountProtected("/history", history);
mountProtected("/users", users);
mountProtected("/notifications", notifications);

app.route("/", api);

// Start and listen to server
const startServer = async () => {
  await testDbConnection();
  await dizzleCheck();

  // Railway provides PORT; local dev uses SERVER_PORT
  const port = Number(process.env.PORT || process.env.SERVER_PORT || 3000);

  serve(
    {
      fetch: app.fetch,
      port,
      hostname: "0.0.0.0",
    },
    (info) => {
      console.log(`\nServer is running on http://localhost:${info.port}`);
      console.log(`Auth endpoints: http://localhost:${info.port}/api/auth/*`);
      console.log(`Frontend origin (CORS): ${frontendOrigin}`);
    },
  );
};

startServer();
