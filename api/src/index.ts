import { serve } from "@hono/node-server";
import { Hono } from "hono";

// Import route modules
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
app.route("/dashboard", dashboard);
app.route("/aanvraag", aanvraag);
app.route("/totale-aanvraag", totaleAanvraag);
app.route("/statistieken", statistieken);
app.route("/geschiedenis", geschiedenis);
app.route("/settings", settings);
app.route("/profiel", profiel);

//Start and listen to server
serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
