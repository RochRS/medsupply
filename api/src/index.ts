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
import { aanvraag } from "./routes/aanvraag.js";
import { profiel } from "./routes/profiel.js";
import { geschiedenis } from "./routes/geschiedenis.js";
import { settings } from "./routes/settings.js";
import { totaleAanvraag } from "./routes/totale-aanvraag.js";
import { statistieken } from "./routes/statistieken.js";

//Auth
import { auth } from "./routes/auth.js";
import { cors } from "hono/cors";

//----------------------------------
const app = new Hono();

//Better Auth route
app.on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw));

//API ROUTES
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
  await dizzleCheck();

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
export default app;
