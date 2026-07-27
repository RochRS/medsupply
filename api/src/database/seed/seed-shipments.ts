import { db } from "../database.js";
import { shipments, items, suppliers } from "../schemas/schema.js";

export const data = [
  { shipmentBatchId: 1001, GTIN: 1234567890123, cost: 4500, itemName: "IV Saline Bag 500mL", supplierName: "MedSupply Pro" },
  { shipmentBatchId: 1001, GTIN: 1234567890123, cost: 3200, itemName: "IV Saline Bag 1000mL", supplierName: "MedSupply Pro" },
  { shipmentBatchId: 1002, GTIN: 2345678901234, cost: 1800, itemName: "Sterile Gauze Pads 4x4", supplierName: "HealthCare Direct" },
  { shipmentBatchId: 1002, GTIN: 3456789012345, cost: 950, itemName: "Adhesive Bandages Assorted", supplierName: "HealthCare Direct" },
  { shipmentBatchId: 1003, GTIN: 4567890123456, cost: 6200, itemName: "Acetaminophen 500mg", supplierName: "PharmaChoice Inc." },
  { shipmentBatchId: 1003, GTIN: 5678901234567, cost: 8900, itemName: "Amoxicillin 250mg", supplierName: "PharmaChoice Inc." },
  { shipmentBatchId: 1004, GTIN: 6789012345678, cost: 3400, itemName: "Scalpel Blade #10", supplierName: "SurgicalTech International" },
  { shipmentBatchId: 1004, GTIN: 7890123456789, cost: 2800, itemName: "Tissue Forceps", supplierName: "SurgicalTech International" },
  { shipmentBatchId: 1005, GTIN: 8901234567890, cost: 5600, itemName: "Nitrile Gloves - Large", supplierName: "Global Med Distributors" },
  { shipmentBatchId: 1005, GTIN: 9012345678901, cost: 1100, itemName: "Surgical Face Masks", supplierName: "Global Med Distributors" },
];

export async function seed() {
  const itemRows = await db.select({ name: items.itemName, id: items.itemId }).from(items);
  const itemMap = new Map(itemRows.map((r) => [r.name, r.id]));
  const suppRows = await db.select({ name: suppliers.supplierName, id: suppliers.supplierId }).from(suppliers);
  const suppMap = new Map(suppRows.map((r) => [r.name, r.id]));
  const existing = await db.select({ batchId: shipments.shipmentBatchId, itemId: shipments.itemId, supplierId: shipments.suppliersId }).from(shipments);
  const existingKeys = new Set(existing.map((r) => `${r.batchId}-${r.itemId}-${r.supplierId}`));
  const now = new Date();
  const toInsert = data.map((d) => ({ shipmentBatchId: d.shipmentBatchId, GTIN: d.GTIN, experationDate: new Date(now.getFullYear() + 2, 11, 31), cost: d.cost, deliveryDate: new Date(now.getFullYear(), 0, 15), itemId: itemMap.get(d.itemName), suppliersId: suppMap.get(d.supplierName) })).filter((d) => d.itemId != null && d.suppliersId != null && !existingKeys.has(`${d.shipmentBatchId}-${d.itemId}-${d.suppliersId}`));
  if (toInsert.length === 0) { console.log(`  ∼ shipments: all ${data.length} already exist`); return []; }
  const inserted = await db.insert(shipments).values(toInsert).returning();
  console.log(`  ✓ shipments: ${inserted.length} inserted (${data.length - inserted.length} already existed)`);
  return inserted;
}

const isMain = process.argv[1]?.includes("seed-shipments");
if (isMain) { seed().then(() => process.exit(0)).catch((err) => { console.error("❌ seed-shipments failed:", err); process.exit(1); }); }
