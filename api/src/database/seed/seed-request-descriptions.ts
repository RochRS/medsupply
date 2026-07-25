import { db } from "../database.js";
import { requestDescription } from "../schemas/schema.js";

export const data = [
  { requestDescriptionField: "Urgent: Low stock alert — immediate replenishment needed within 24 hours" },
  { requestDescriptionField: "Routine restock — standard monthly inventory replenishment" },
  { requestDescriptionField: "Emergency order — unexpected surge in patient intake, critical shortage" },
  { requestDescriptionField: "Replacement for expired inventory — batch EOL items being swapped out" },
  { requestDescriptionField: "New department request — establishing new ward, initial stock required" },
];

export async function seed() {
  const existing = await db.select({ field: requestDescription.requestDescriptionField }).from(requestDescription);
  const existingFields = new Set(existing.map((r) => r.field));
  const newData = data.filter((d) => !existingFields.has(d.requestDescriptionField));
  if (newData.length === 0) { console.log(`  ∼ request descriptions: all ${data.length} already exist`); return []; }
  const inserted = await db.insert(requestDescription).values(newData).returning();
  console.log(`  ✓ request descriptions: ${inserted.length} inserted (${data.length - inserted.length} already existed)`);
  return inserted;
}

const isMain = process.argv[1]?.includes("seed-request-descriptions") || process.argv[1]?.includes("seed-request_descriptions");
if (isMain) { seed().then(() => process.exit(0)).catch((err) => { console.error("❌ seed-request-descriptions failed:", err); process.exit(1); }); }
