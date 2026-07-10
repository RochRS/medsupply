import { Hono } from "hono";

export const totaleVoorraad = new Hono();

totaleVoorraad.get("/get-total-items-numbers", async (c) => {
});

totaleVoorraad.get("/get-kritiek-laag-numbers", async (c) => {
});

totaleVoorraad.get("/get-total-items-info", async (c) => {
});