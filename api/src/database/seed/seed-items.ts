import { db } from "../database.js";
import { items, categories } from "../schemas/schema.js";

export const data = [
  { itemName: "IV Saline Bag 500mL", description: "Steriel 0,9% NaCl, 500mL", remainingAmount: 240, categoryName: "IV Supplies" },
  { itemName: "IV Saline Bag 1000mL", description: "Steriel 0,9% NaCl, 1000mL", remainingAmount: 180, categoryName: "IV Supplies" },
  { itemName: "IV Tubing Set", description: "Standaard infuusset met driprechamber", remainingAmount: 320, categoryName: "IV Supplies" },
  { itemName: "Peripheral IV Catheter 22G", description: "22G perifeer IV katheter", remainingAmount: 500, categoryName: "IV Supplies" },
  { itemName: "IV Catheter 18G", description: "18G groene IV katheter", remainingAmount: 210, categoryName: "IV Supplies" },
  { itemName: "Sterile Gauze Pads 4x4", description: "Steriel gaas 10x10cm, 100 stuks", remainingAmount: 85, categoryName: "Wound Care" },
  { itemName: "Adhesive Bandages Assorted", description: "Gemengde pleisters, 200 stuks", remainingAmount: 150, categoryName: "Wound Care" },
  { itemName: "Medical Tape 2 inch", description: "Medische tape 5cm, hypoallergeen", remainingAmount: 60, categoryName: "Wound Care" },
  { itemName: "Hydrocolloid Dressing", description: "Hydrocolloïd wondverband 10x10", remainingAmount: 48, categoryName: "Wound Care" },
  { itemName: "Scalpel Blade #10", description: "Steriel scalpelmesje #10", remainingAmount: 40, categoryName: "Surgical Instruments" },
  { itemName: "Tissue Forceps", description: "Weefselpincet 15cm", remainingAmount: 25, categoryName: "Surgical Instruments" },
  { itemName: "Surgical Scissors", description: "Operatieschaar 14cm", remainingAmount: 30, categoryName: "Surgical Instruments" },
  { itemName: "Nitrile Gloves - Large", description: "Nitril handschoenen L, 100 stuks", remainingAmount: 200, categoryName: "Personal Protective Equipment" },
  { itemName: "Nitrile Gloves - Medium", description: "Nitril handschoenen M, 100 stuks", remainingAmount: 180, categoryName: "Personal Protective Equipment" },
  { itemName: "Surgical Face Masks", description: "Chirurgische maskers, 50 stuks", remainingAmount: 300, categoryName: "Personal Protective Equipment" },
  { itemName: "N95 Respirator Masks", description: "N95 ademhalingsmaskers", remainingAmount: 120, categoryName: "Personal Protective Equipment" },
  { itemName: "Paracetamol 500mg", description: "Paracetamol tabletten 500mg", remainingAmount: 75, categoryName: "Medications" },
  { itemName: "Amoxicillin 250mg", description: "Amoxicilline capsules 250mg", remainingAmount: 90, categoryName: "Medications" },
  { itemName: "Ibuprofen 400mg", description: "Ibuprofen tabletten 400mg", remainingAmount: 60, categoryName: "Medications" },
  { itemName: "Metformine 500mg", description: "Metformine tabletten 500mg", remainingAmount: 110, categoryName: "Medications" },
  { itemName: "Omeprazol 20mg", description: "Omeprazol capsules 20mg", remainingAmount: 95, categoryName: "Medications" },
  { itemName: "Digital Thermometer", description: "Digitale thermometer", remainingAmount: 45, categoryName: "Diagnostic Equipment" },
  { itemName: "Blood Pressure Cuff - Adult", description: "Bloeddrukmeter manchet volwassenen", remainingAmount: 20, categoryName: "Diagnostic Equipment" },
  { itemName: "Stethoscope", description: "Dubbele stethoscoop", remainingAmount: 15, categoryName: "Diagnostic Equipment" },
  { itemName: "Pulse Oximeter", description: "Vinger-oximeter", remainingAmount: 28, categoryName: "Diagnostic Equipment" },
  { itemName: "Oxygen Mask - Adult", description: "Zuurstofmasker volwassenen", remainingAmount: 55, categoryName: "Respiratory" },
  { itemName: "Nebulizer Kit", description: "Vernevelset compleet", remainingAmount: 12, categoryName: "Respiratory" },
  { itemName: "Oxygen Nasal Cannula", description: "Neusbril zuurstof", remainingAmount: 70, categoryName: "Respiratory" },
  { itemName: "Defibrillator Pads - Adult", description: "AED pads volwassenen", remainingAmount: 8, categoryName: "Emergency" },
  { itemName: "Tourniquet - Combat Application", description: "CAT tourniquet", remainingAmount: 35, categoryName: "Emergency" },
  { itemName: "First Aid Kit - Large", description: "Grote EHBO-kit 200-delig", remainingAmount: 10, categoryName: "Emergency" },
  { itemName: "Adrenaline 1mg/mL", description: "Adrenaline ampul 1mg/mL", remainingAmount: 18, categoryName: "Emergency" },
  { itemName: "Ciprofloxacine 500mg", description: "Ciprofloxacine tabletten 500mg", remainingAmount: 42, categoryName: "Antibiotica" },
  { itemName: "Azitromycine 250mg", description: "Azitromycine tabletten 250mg", remainingAmount: 55, categoryName: "Antibiotica" },
  { itemName: "Flucloxacilline 500mg", description: "Flucloxacilline capsules 500mg", remainingAmount: 38, categoryName: "Antibiotica" },
  { itemName: "Morfine 10mg/mL", description: "Morfine ampul 10mg/mL", remainingAmount: 14, categoryName: "Pijnstilling" },
  { itemName: "Tramadol 50mg", description: "Tramadol capsules 50mg", remainingAmount: 66, categoryName: "Pijnstilling" },
  { itemName: "Diclofenac 50mg", description: "Diclofenac tabletten 50mg", remainingAmount: 80, categoryName: "Pijnstilling" },
];

export async function seed() {
  const catRows = await db
    .select({ name: categories.categoryName, id: categories.categoryId })
    .from(categories);
  const catMap = new Map(catRows.map((r) => [r.name, r.id]));
  const existing = await db.select({ name: items.itemName }).from(items);
  const existingNames = new Set(existing.map((r) => r.name));

  const toInsert = data
    .filter((d) => !existingNames.has(d.itemName))
    .map((d) => ({
      itemName: d.itemName,
      description: d.description,
      remainingAmount: d.remainingAmount,
      categoryId: catMap.get(d.categoryName),
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
    .filter((d) => d.categoryId != null);

  if (toInsert.length === 0) {
    console.log(`  ∼ items: all ${data.length} already exist`);
    return [];
  }

  const inserted = await db.insert(items).values(toInsert).returning();
  console.log(
    `  ✓ items: ${inserted.length} inserted (${data.length - inserted.length} already existed)`,
  );
  return inserted;
}

const isMain = process.argv[1]?.includes("seed-items");
if (isMain) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ seed-items failed:", err);
      process.exit(1);
    });
}
