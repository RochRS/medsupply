import { db } from "../database.js";
import { user } from "../schemas/auth-schema.js";

export const data = [
  { id: "usr_001", name: "Dr. Sarah Johnson", email: "sarah.johnson@medsupply.com", emailVerified: true },
  { id: "usr_002", name: "Dr. Michael Chen", email: "michael.chen@medsupply.com", emailVerified: true },
  { id: "usr_003", name: "Nurse Emily Rodriguez", email: "emily.rodriguez@medsupply.com", emailVerified: true },
  { id: "usr_004", name: "Nurse James Wilson", email: "james.wilson@medsupply.com", emailVerified: true },
  { id: "usr_005", name: "Admin Lisa Thompson", email: "lisa.thompson@medsupply.com", emailVerified: true },
];

export async function seed() {
  const existing = await db.select({ email: user.email }).from(user);
  const existingEmails = new Set(existing.map((r) => r.email));
  const newData = data.filter((d) => !existingEmails.has(d.email));
  if (newData.length === 0) { console.log(`  ∼ users: all ${data.length} already exist`); return []; }
  const inserted = await db.insert(user).values(newData).returning();
  console.log(`  ✓ users: ${inserted.length} inserted (${data.length - inserted.length} already existed)`);
  return inserted;
}

const isMain = process.argv[1]?.includes("seed-users");
if (isMain) { seed().then(() => process.exit(0)).catch((err) => { console.error("❌ seed-users failed:", err); process.exit(1); }); }
