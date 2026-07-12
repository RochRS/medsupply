//DOT ENV
import "dotenv/config";

//Server Import
import { serve } from "@hono/node-server";
import { Hono } from "hono";

// Import database connection and test functions
import { testDbConnection } from "./database/database.js";
import { dizzleCheck } from "./database/database.js";

// Import route modules
import { dashboard } from "./routes/dashboard.js";
import { settings } from "./routes/settings.js";
import { requests } from "./routes/requests.js";
import { inventory } from "./routes/inventory.js";
import { statistics } from "./routes/statistics.js";
import { history } from "./routes/history.js";
import { profile } from "./routes/profile.js";

//Auth
import { auth } from "./auth/auth.js";
import { cors } from "hono/cors";

//----------------------------------

//Hono Object
const app = new Hono().basePath("/api");

// CORS Setup
app.use(
  cors({
    origin: "http://example.com",
    allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  }),
);

//Better Auth route
app.on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw));

//API ROUTES
app.route("/dashboard", dashboard);
app.route("/requests", requests);
app.route("/inventory", inventory);
app.route("/statistics", statistics);
app.route("/history", history);
app.route("/settings", settings);
app.route("/profile", profile);

//Start and listen to server
const startServer = async () => {
  await testDbConnection();
  await dizzleCheck();

  serve(
    {
      fetch: app.fetch,
      port: Number(process.env.SERVER_PORT || 3000),
    },
    (info) => {
      console.log(`\nServer is running on http://localhost:${info.port}`);
    },
  );
};

startServer();
