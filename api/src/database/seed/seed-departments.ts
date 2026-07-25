import { db } from "../database.js";
import { department } from "../schemas/auth-schema.js";

export const data = [
  { departmentName: "Emergency Room" },
  { departmentName: "Intensive Care Unit" },
  { departmentName: "Surgery" },
  { departmentName: "Pediatrics" },
  { departmentName: "Pharmacy" },
  { departmentName: "Cardiology" },
  { departmentName: "Orthopedics" },
  { departmentName: "Radiology" },
];

export async function seed() {
  const existing = await db.select({ name: department.departmentName }).from(department);
  const existingNames = new Set(existing.map((r) => r.name));
  const newData = data.filter((d) => !existingNames.has(d.departmentName));
  if (newData.length === 0) { console.log(`  ∼ departments: all ${data.length} already exist`); return []; }
  const inserted = await db.insert(department).values(newData).returning();
  console.log(`  ✓ departments: ${inserted.length} inserted (${data.length - inserted.length} already existed)`);
  return inserted;
}

const isMain = process.argv[1]?.includes("seed-departments");
if (isMain) { seed().then(() => process.exit(0)).catch((err) => { console.error("❌ seed-departments failed:", err); process.exit(1); }); }
