import { Hono } from "hono";

export const dashboard = new Hono();

//spoedaanvraag
dashboard.post("/send-spoedaanvraag-request", async (c) => {});

dashboard.get("/get-spoed-items-names", async (c) => {});

//kritieke voorraad
dashboard.get("/get-kritiek-laag", async (c) => {});
dashboard.get("/get-kritiek-items-names", async (c) => {});
dashboard.get("/get-total-items-list", async (c) => {});

//meldingen
dashboard.get("/get-meldingen-numbers", async (c) => {});

dashboard.get("/get-spoedmeldingen-numbers", async (c) => {});

dashboard.get("/get-total-meldingen-list", async (c) => {});
