import { Hono } from "hono";

export const requests = new Hono();

requests.get("/", async (c) => {
  return c.json({ message: "List all requests" });
});

requests.post("/", async (c) => {
  return c.json({ message: "Create a new request" }, 201);
});

requests.get("/:id", async (c) => {
  const id = c.req.param("id");
  return c.json({ message: `Get request ${id}` });
});

requests.patch("/:id", async (c) => {
  const id = c.req.param("id");
  return c.json({ message: `Update request ${id}` });
});

requests.delete("/:id", async (c) => {
  const id = c.req.param("id");
  return c.json({ message: `Delete request ${id}` });
});
