import { db } from "../database/database.js";

export const userRole = async () => {
  return await db.query.users.findMany({
    columns: {
      id: true,
      role: true,
    },
  });
};
