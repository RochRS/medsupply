import { createMiddleware } from "hono/factory";

export const logger = createMiddleware(async (c, next) => {
  console.log(`${c.req.method} ${c.req.url}`);
  await next();
});

// Auth middleware lives in ./auth.ts (loadSession, requireAuth)
// Validation middleware lives in ./validate.ts
