import { Hono } from "hono";
const app = new Hono();
app.post("/login", async (c) => {
    const { email, password } = await c.req.json();
    return c.json({ message: "Logged in", email });
});
app.post("/register", async (c) => {
    const { email, password } = await c.req.json();
    return c.json({ message: "Registered", email });
});
export default app;
