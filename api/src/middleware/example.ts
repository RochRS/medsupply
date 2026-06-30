import { createMiddleware } from "hono/factory";

export const logger = createMiddleware(async (c, next) => {
  console.log(`${c.req.method} ${c.req.url}`);
  await next();
});

export const requireAuth = createMiddleware(async (c, next) => {
  const token = c.req.header("Authorization");
  if (!token) return c.json({ message: "Unauthorized" }, 401);
  await next();
});
