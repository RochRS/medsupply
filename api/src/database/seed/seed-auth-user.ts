import "dotenv/config";
import { eq, notInArray } from "drizzle-orm";
import { auth } from "../../auth/auth.js";
import { db } from "../database.js";
import { user, role, request } from "../schemas/schema.js";
import { ROLE_NAMES } from "./seed-roles.js";

/** Exactly one loginable account per role */
export const TEST_USERS = [
  {
    name: "Admin MedSupply",
    email: "admin@medsupply.com",
    password: "Test1234!",
    roleName: ROLE_NAMES.ADMIN,
  },
  {
    name: "Apotheker MedSupply",
    email: "apotheker@medsupply.com",
    password: "Test1234!",
    roleName: ROLE_NAMES.APOTHEKER,
  },
  {
    name: "Verpleging MedSupply",
    email: "verpleging@medsupply.com",
    password: "Test1234!",
    roleName: ROLE_NAMES.VERPLEGING,
  },
] as const;

const KEEP_EMAILS = TEST_USERS.map((u) => u.email);

export async function seed() {
  const roles = await db.select().from(role);
  const roleMap = new Map(roles.map((r) => [r.roleName, r.roleId]));
  const created: string[] = [];

  for (const account of TEST_USERS) {
    const roleId = roleMap.get(account.roleName) ?? null;
    const existing = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, account.email))
      .limit(1);

    let userId = existing[0]?.id;

    if (!userId) {
      await auth.api.signUpEmail({
        body: {
          name: account.name,
          email: account.email,
          password: account.password,
        },
      });
      const createdUser = await db
        .select({ id: user.id })
        .from(user)
        .where(eq(user.email, account.email))
        .limit(1);
      userId = createdUser[0]?.id;
      if (userId) created.push(account.email);
    }

    if (userId) {
      await db
        .update(user)
        .set({ roleId, name: account.name, mustChangePassword: false })
        .where(eq(user.id, userId));
    }
  }

  // Remove extra seed/demo accounts so admin list stays 1 user per role
  const extras = await db
    .select({ id: user.id, email: user.email })
    .from(user)
    .where(notInArray(user.email, [...KEEP_EMAILS]));

  for (const extra of extras) {
    await db
      .update(request)
      .set({ userId: null })
      .where(eq(request.userId, extra.id));
    await db.delete(user).where(eq(user.id, extra.id));
  }

  console.log(
    `  ✓ auth users: ${created.length} created, roles assigned; ${extras.length} extra user(s) removed`,
  );
  return created.map((email) => ({ email }));
}

const isMain = process.argv[1]?.includes("seed-auth-user");
if (isMain) {
  seed()
    .then(() => {
      console.log("\nTest login credentials (password: Test1234!):");
      for (const u of TEST_USERS) {
        console.log(`  ${u.roleName.padEnd(12)} ${u.email}`);
      }
      console.log("");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ seed-auth-user failed:", err);
      process.exit(1);
    });
}
