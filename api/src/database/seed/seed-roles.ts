import { db } from "../database.js";
import { role } from "../schemas/auth-schema.js";

export const data = [
  { roleName: "Admin" },
  { roleName: "Doctor" },
  { roleName: "Nurse" },
  { roleName: "Pharmacist" },
  { roleName: "Lab Technician" },
  { roleName: "Radiologist" },
  { roleName: "Surgeon" },
  { roleName: "Department Head" },
  { roleName: "Inventory Manager" },
  { roleName: "Viewer" },
];

export async function seed() {
  const existing = await db.select({ name: role.roleName }).from(role);
  const existingNames = new Set(existing.map((r) => r.name));
  const newData = data.filter((d) => !existingNames.has(d.roleName));
  if (newData.length === 0) { console.log(`  ∼ roles: all ${data.length} already exist`); return []; }
  const inserted = await db.insert(role).values(newData).returning();
  console.log(`  ✓ roles: ${inserted.length} inserted (${data.length - inserted.length} already existed)`);
  return inserted;
}

const isMain = process.argv[1]?.includes("seed-roles");
if (isMain) { seed().then(() => process.exit(0)).catch((err) => { console.error("❌ seed-roles failed:", err); process.exit(1); }); }