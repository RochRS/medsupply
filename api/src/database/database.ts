import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schemas/schema.js";

import "dotenv/config";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

//maybe we have to import relations or the schema ts in drizzle
export const db = drizzle(pool, { schema });

export const testDbConnection = async (): Promise<void> => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("\n✅ PostgreSQL connected successfully at:", res.rows[0].now);
  } catch (error) {
    console.error("\n❌ PostgreSQL connection error:", error);
    process.exit(1);
  }
};

export const dizzleCheck = async () => {
  try {
    const result = await db.execute("SELECT 1 AS test");

    console.log(
      "\n✅ Drizzle ORM executed successfully. Rows returned:",
      result.rows,
    );
  } catch (error) {
    console.error("\n⚠️ Drizzle check failed, DRIZZLE ERROR:", error);
  }
};
