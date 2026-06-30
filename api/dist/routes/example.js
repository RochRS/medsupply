import { Hono } from "hono";
const app = new Hono();
app.get("/", (c) => c.json({ message: "List all items" }));
app.get("/:id", (c) => {
    const id = c.req.param("id");
    return c.json({ message: `Get item ${id}` });
});
app.post("/", async (c) => {
    const body = await c.req.json();
    return c.json({ message: "Created", body }, 201);
});
app.put("/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json();
    return c.json({ message: `Updated item ${id}`, body });
});
app.delete("/:id", (c) => {
    const id = c.req.param("id");
    return c.json({ message: `Deleted item ${id}` });
});
export default app;
