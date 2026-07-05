import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import "dotenv/config";

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const dizzleCheck = async () => {
  try {
    const db = drizzle({ client: pool });
    const result = await db.execute("SELECT 1 AS test");

    console.log(
      "\n✅ Drizzle ORM executed successfully. Rows returned:",
      result.rows,
    );
  } catch (error) {
    console.error(
      "\n⚠️ Drizzle check failed, but keeping server alive:",
      error,
    );
  }
};

export const testDbConnection = async (): Promise<void> => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("\n✅ PostgreSQL connected successfully at:", res.rows[0].now);
  } catch (error) {
    console.error("\n❌ PostgreSQL connection error:", error);
    process.exit(1);
  }
};
