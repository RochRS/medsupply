import { Hono } from "hono";
import { userRole } from "../services/user-info-request.js";

export const aanvraag = new Hono();

aanvraag.get("/", (c) => c.json({ message: "List all items" }));

aanvraag.post("/send-aanvraag-request", async (c) => {
  //   userRole();
});
