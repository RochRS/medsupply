import "dotenv/config";
import { eq } from "drizzle-orm";
import { auth } from "../../auth/auth.js";
import { db } from "../database.js";
import { user } from "../schemas/schema.js";

/** Dev-only test account for local login */
export const TEST_USER = {
  name: "Test User",
  email: "test@medsupply.com",
  password: "Test1234!",
};

export async function seed() {
  const existing = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, TEST_USER.email))
    .limit(1);

  if (existing.length > 0) {
    console.log(`  ∼ auth user: ${TEST_USER.email} already exists`);
    return existing;
  }

  const result = await auth.api.signUpEmail({
    body: {
      name: TEST_USER.name,
      email: TEST_USER.email,
      password: TEST_USER.password,
    },
  });

  console.log(`  ✓ auth user: created ${TEST_USER.email}`);
  console.log(`    password: ${TEST_USER.password}`);
  return result ? [result] : [];
}

const isMain = process.argv[1]?.includes("seed-auth-user");
if (isMain) {
  seed()
    .then(() => {
      console.log("\nTest login credentials:");
      console.log(`  email:    ${TEST_USER.email}`);
      console.log(`  password: ${TEST_USER.password}\n`);
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ seed-auth-user failed:", err);
      process.exit(1);
    });
}
