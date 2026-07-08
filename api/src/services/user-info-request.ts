import { db } from "../database/database.js";

export const userRole = async () => {
  await db.query.users
    .findMany({
      columns: {
        id: true,
        role: true,
      },
    })
    .catch((e) => {});
};
