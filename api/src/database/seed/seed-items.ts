import { db } from "../database.js";
import { items, categories } from "../schemas/schema.js";

export const data = [
  { itemName: "IV Saline Bag 500mL", description: "Sterile 0.9% sodium chloride IV solution, 500mL", remainingAmount: 240, categoryName: "IV Supplies" },
  { itemName: "IV Saline Bag 1000mL", description: "Sterile 0.9% sodium chloride IV solution, 1000mL", remainingAmount: 180, categoryName: "IV Supplies" },
  { itemName: "IV Tubing Set", description: "Standard IV administration set with drip chamber", remainingAmount: 320, categoryName: "IV Supplies" },
  { itemName: "Peripheral IV Catheter 22G", description: "22-gauge peripheral IV catheter with safety mechanism", remainingAmount: 500, categoryName: "IV Supplies" },
  { itemName: "Sterile Gauze Pads 4x4", description: "Sterile 4x4 inch gauze pads, pack of 100", remainingAmount: 85, categoryName: "Wound Care" },
  { itemName: "Adhesive Bandages Assorted", description: "Assorted sizes of adhesive bandages, box of 200", remainingAmount: 150, categoryName: "Wound Care" },
  { itemName: "Medical Tape 2 inch", description: "Hypoallergenic medical tape, 2 inch width, 10 yard roll", remainingAmount: 60, categoryName: "Wound Care" },
  { itemName: "Scalpel Blade #10", description: "Sterile surgical scalpel blade size #10, box of 50", remainingAmount: 40, categoryName: "Surgical Instruments" },
  { itemName: "Tissue Forceps", description: "Straight tissue forceps with teeth, 6 inch", remainingAmount: 25, categoryName: "Surgical Instruments" },
  { itemName: "Surgical Scissors", description: "Sharp/sharp operating scissors, 5.5 inch", remainingAmount: 30, categoryName: "Surgical Instruments" },
  { itemName: "Nitrile Gloves - Large", description: "Powder-free nitrile examination gloves, large, box of 100", remainingAmount: 200, categoryName: "Personal Protective Equipment" },
  { itemName: "Nitrile Gloves - Medium", description: "Powder-free nitrile examination gloves, medium, box of 100", remainingAmount: 180, categoryName: "Personal Protective Equipment" },
  { itemName: "Surgical Face Masks", description: "Level 3 surgical face masks, box of 50", remainingAmount: 300, categoryName: "Personal Protective Equipment" },
  { itemName: "N95 Respirator Masks", description: "N95 particulate respirator masks, individually wrapped", remainingAmount: 120, categoryName: "Personal Protective Equipment" },
  { itemName: "Acetaminophen 500mg", description: "Acetaminophen tablets 500mg, bottle of 100", remainingAmount: 75, categoryName: "Medications" },
  { itemName: "Amoxicillin 250mg", description: "Amoxicillin capsules 250mg, bottle of 30", remainingAmount: 90, categoryName: "Medications" },
  { itemName: "Ibuprofen 400mg", description: "Ibuprofen tablets 400mg, bottle of 50", remainingAmount: 60, categoryName: "Medications" },
  { itemName: "Digital Thermometer", description: "Digital oral/rectal thermometer with flexible tip", remainingAmount: 45, categoryName: "Diagnostic Equipment" },
  { itemName: "Blood Pressure Cuff - Adult", description: "Adult-sized manual blood pressure cuff with gauge", remainingAmount: 20, categoryName: "Diagnostic Equipment" },
  { itemName: "Stethoscope", description: "Dual-head stethoscope with non-chill rim", remainingAmount: 15, categoryName: "Diagnostic Equipment" },
  { itemName: "Oxygen Mask - Adult", description: "Adult non-rebreather oxygen mask with tubing", remainingAmount: 55, categoryName: "Respiratory" },
  { itemName: "Nebulizer Kit", description: "Compressor nebulizer with mouthpiece and tubing", remainingAmount: 12, categoryName: "Respiratory" },
  { itemName: "Defibrillator Pads - Adult", description: "Adult multifunction defibrillator electrode pads, pair", remainingAmount: 8, categoryName: "Emergency" },
  { itemName: "Tourniquet - Combat Application", description: "Combat application tourniquet (CAT) with windlass", remainingAmount: 35, categoryName: "Emergency" },
  { itemName: "First Aid Kit - Large", description: "Large wall-mountable first aid kit, 200-piece", remainingAmount: 10, categoryName: "Emergency" },
];

export async function seed() {
  const catRows = await db.select({ name: categories.categoryName, id: categories.categoryId }).from(categories);
  const catMap = new Map(catRows.map((r) => [r.name, r.id]));
  const existing = await db.select({ name: items.itemName }).from(items);
  const existingNames = new Set(existing.map((r) => r.name));
  const toInsert = data.filter((d) => !existingNames.has(d.itemName)).map((d) => ({ itemName: d.itemName, description: d.description, remainingAmount: d.remainingAmount, categoryId: catMap.get(d.categoryName) })).filter((d) => d.categoryId != null);
  if (toInsert.length === 0) { console.log(`  ∼ items: all ${data.length} already exist`); return []; }
  const inserted = await db.insert(items).values(toInsert).returning();
  console.log(`  ✓ items: ${inserted.length} inserted (${data.length - inserted.length} already existed)`);
  return inserted;
}

const isMain = process.argv[1]?.includes("seed-items");
if (isMain) { seed().then(() => process.exit(0)).catch((err) => { console.error("❌ seed-items failed:", err); process.exit(1); }); }
