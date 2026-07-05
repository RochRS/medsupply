import { serve } from "@hono/node-server";
import { Hono } from "hono";

import "dotenv/config";
import { testDbConnection } from "./database/database.js";

// Import route modules
import { auth } from "./routes/auth.js";
import { dashboard } from "./routes/dashboard.js";
import { aanvraag } from "./routes/aanvraag.js";
import { profiel } from "./routes/profiel.js";
import { geschiedenis } from "./routes/geschiedenis.js";
import { settings } from "./routes/settings.js";
import { totaleAanvraag } from "./routes/totale-aanvraag.js";
import { statistieken } from "./routes/statistieken.js";

//----------------------------------
const app = new Hono();

//API Index route
app.get("/", (c) =>
  c.json({
    message: "Welcome to the Med Supply API",
    routes: [
      "/auth/login: Log in",
      "/auth/logout: Log out",
      "/dashboard: Get dashboard data",
      "/aanvraag: Create a new request",
      "/totale-aanvraag: Get total requests",
      "/statistieken: Get statistics",
      "/geschiedenis: Get history",
      "/settings: Update settings",
      "/profiel: Get user profile",
    ],
    version: "1.0.0",
  }),
);

//API ROUTES
app.route("/auth", auth);
app.route("/dashboard", dashboard);
app.route("/aanvraag", aanvraag);
app.route("/totale-aanvraag", totaleAanvraag);
app.route("/statistieken", statistieken);
app.route("/geschiedenis", geschiedenis);
app.route("/settings", settings);
app.route("/profiel", profiel);

//Start and listen to server
const startServer = async () => {
  await testDbConnection();
  serve(
    {
      fetch: app.fetch,
      port: Number(process.env.PORT || 3000),
    },
    (info) => {
      console.log(`\nServer is running on http://localhost:${info.port}`);
    },
  );
};

startServer();
