//DOT ENV
import "dotenv/config";

//Server Import
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";

// Import database connection and test functions
import { testDbConnection, dizzleCheck } from "./database/database.js";

// Import route modules
import { requests } from "./routes/requests.js";
import { items } from "./routes/items.js";
import { statistics } from "./routes/statistics.js";
import { history } from "./routes/history.js";
import { users } from "./routes/users.js";
import { session } from "./routes/session.js";
import { login } from "./routes/login.js";

// Auth
import { auth } from "./auth/auth.js";
import { loadSession, requireAuth } from "./middleware/auth.js";
import { logger } from "./middleware/example.js";
import type { AppEnv } from "./types/hono.js";

//----------------------------------

// Frontend URL for CORS (strip trailing slash)
// const frontendOrigin =
//   process.env.FRONTEND_URL?.replace(/\/$/, "") || "http://localhost:5173";

// All API routes live under /api
const app = new Hono<AppEnv>().basePath("/api");

app.get("/", async (c) => {
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
      users: "/api/users",
      sessions: "/api/sessions",
    },
  });
});
// Basic browser security headers
// app.use("*", secureHeaders());

// Log each request
// app.use("*", logger);

// Allow the Vite frontend to call this API (with cookies)
// app.use(
//   "*",
//   cors({
//     origin: frontendOrigin,
//     allowHeaders: ["Content-Type", "Authorization"],
//     allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     exposeHeaders: ["Content-Length"],
//     maxAge: 600,
//     credentials: true,
//   }),
// );

// better-auth handles login / signup / logout / session
// /** matches nested paths like /auth/sign-in/email
// app.on(["POST", "GET"], "/auth/**", (c) => auth.handler(c.req.raw));

// Load user/session on every request (may be null)
// app.use("*", loadSession);

// Public session helpers (/sessions/me, /sessions/health)
// app.route("/sessions", session);

// Public demo: validate + sanitize login payload (not a real login)
// app.route("/", login);

// Everything below needs a logged-in user
const protectedRoutes = new Hono<AppEnv>();
// protectedRoutes.use("*", requireAuth);
protectedRoutes.route("/requests", requests);
protectedRoutes.route("/items", items);
protectedRoutes.route("/statistics", statistics);
protectedRoutes.route("/history", history);
protectedRoutes.route("/users", users);

// app.route("/", protectedRoutes);

// Start and listen to server
const startServer = async () => {
  await testDbConnection();
  await dizzleCheck();

  serve(
    {
      fetch: protectedRoutes.fetch,
      port: Number(process.env.SERVER_PORT || 3000),
    },
    (info) => {
      console.log(`\nServer is running on http://localhost:${info.port}`);
      // console.log(`Auth endpoints: http://localhost:${info.port}/api/auth/*`);
      // console.log(`Frontend origin (CORS): ${frontendOrigin}`);
    },
  );
};

startServer();
