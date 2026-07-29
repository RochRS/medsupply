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
  { categoryName: "Laboratory", categoryDescription: "Lab supplies, test tubes, reagents, and diagnostic kits" },
  { categoryName: "Radiology", categoryDescription: "X-ray film, contrast media, and imaging supplies" },
  { categoryName: "Orthopedics", categoryDescription: "Casts, splints, braces, and orthopedic implants" },
  { categoryName: "Ophthalmology", categoryDescription: "Eye examination tools, drops, and surgical instruments" },
  { categoryName: "Gastroenterology", categoryDescription: "Endoscopy supplies, biopsy tools, and GI consumables" },
  { categoryName: "Urology", categoryDescription: "Catheters, urine collection bags, and urological instruments" },
  { categoryName: "Anesthesiology", categoryDescription: "Anesthesia masks, airways, and monitoring equipment" },
  { categoryName: "Cardiology", categoryDescription: "ECG electrodes, pacemaker supplies, and cardiac catheters" },
  { categoryName: "Neonatal", categoryDescription: "Incubator supplies, neonatal monitors, and pediatric equipment" },
  { categoryName: "Dialysis", categoryDescription: "Dialyzers, dialysis tubing, and fistula needles" },
  { categoryName: "Infection Control", categoryDescription: "Disinfectants, antiseptics, and sterilization supplies" },
  { categoryName: "Nutrition", categoryDescription: "Feeding tubes, nutritional supplements, and enteral feeding sets" },
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
