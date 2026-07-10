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
import { totaleVoorraad } from "./routes/totale-voorraad.js";
import { statistieken } from "./routes/statistieken.js";

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
app.route("/aanvraag", aanvraag);
app.route("/totale-voorraad", totaleVoorraad);
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
      port: Number(process.env.SERVER_PORT || 3000),
    },
    (info) => {
      console.log(`\nServer is running on http://localhost:${info.port}`);
    },
  );
};

startServer();
