import { Hono } from "hono";

export const aanvraag = new Hono();


aanvraag.post("/send-aanvraag-request", async (c) => {
});

aanvraag.get("/get-items-names-ammount", async (c) => {
});
