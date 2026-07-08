import type { Context } from "hono";
import { db } from "../database/database.js";

export const userRole: Object = async (c: Context) => {
  const userRoleName = await db.query.users
    .findMany({
      columns: {
        id: true,
        role: true,
      },
    })
    .catch((e) => {});

  return userRoleName;
};
