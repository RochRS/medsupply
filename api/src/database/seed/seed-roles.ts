import { db } from "../database.js";
import { role } from "../schemas/schema.js";

export const ROLE_NAMES = {
  ADMIN: "admin",
  APOTHEKER: "apotheker",
  VERPLEGING: "verpleging",
} as const;

export type RoleName = (typeof ROLE_NAMES)[keyof typeof ROLE_NAMES];

export const data = [
  {
    roleName: ROLE_NAMES.ADMIN,
  },
  {
    roleName: ROLE_NAMES.APOTHEKER,
  },
  {
    roleName: ROLE_NAMES.VERPLEGING,
  },
];

export async function seed() {
  const existing = await db.select({ name: role.roleName }).from(role);
  const existingNames = new Set(existing.map((r) => r.name));
  const newData = data.filter((d) => !existingNames.has(d.roleName));

  if (newData.length === 0) {
    console.log(`  ∼ roles: all ${data.length} already exist`);
    return [];
  }

  const inserted = await db.insert(role).values(newData).returning();
  console.log(
    `  ✓ roles: ${inserted.length} inserted (${data.length - inserted.length} already existed)`,
  );
  return inserted;
}

const isMain = process.argv[1]?.includes("seed-roles");
if (isMain) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ seed-roles failed:", err);
      process.exit(1);
    });
}
