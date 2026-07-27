import { db } from "../database.js";
import { categories } from "../schemas/schema.js";

export const data = [
  { categoryName: "IV Supplies", categoryDescription: "Intravenous therapy supplies including bags, tubing, and catheters" },
  { categoryName: "Wound Care", categoryDescription: "Bandages, gauze, tape, and wound dressing materials" },
  { categoryName: "Surgical Instruments", categoryDescription: "Scalpels, forceps, scissors, and other surgical tools" },
  { categoryName: "Personal Protective Equipment", categoryDescription: "Gloves, masks, gowns, and protective eyewear" },
  { categoryName: "Medications", categoryDescription: "Pharmaceutical drugs and medical solutions" },
  { categoryName: "Diagnostic Equipment", categoryDescription: "Thermometers, blood pressure cuffs, stethoscopes" },
  { categoryName: "Respiratory", categoryDescription: "Oxygen masks, nebulizers, and respiratory therapy equipment" },
  { categoryName: "Emergency", categoryDescription: "Defibrillator pads, tourniquets, and emergency response supplies" },
];

export async function seed() {
  const existing = await db.select({ name: categories.categoryName }).from(categories);
  const existingNames = new Set(existing.map((r) => r.name));
  const newData = data.filter((d) => !existingNames.has(d.categoryName));
  if (newData.length === 0) { console.log(`  ∼ categories: all ${data.length} already exist`); return []; }
  const inserted = await db.insert(categories).values(newData).returning();
  console.log(`  ✓ categories: ${inserted.length} inserted (${data.length - inserted.length} already existed)`);
  return inserted;
}

const isMain = process.argv[1]?.includes("seed-categories");
if (isMain) { seed().then(() => process.exit(0)).catch((err) => { console.error("❌ seed-categories failed:", err); process.exit(1); }); }
