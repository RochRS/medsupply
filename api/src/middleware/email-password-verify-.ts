import type { Context } from "hono";

export const verifyLoginInput = async (c: Context) => {
  try {
    const body = await c.req.json();
  } catch (error: any) {}
};
