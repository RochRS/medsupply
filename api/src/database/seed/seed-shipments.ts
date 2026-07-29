import { db } from "../database.js";
import { shipments, items, suppliers } from "../schemas/schema.js";

export const data = [
  // Batch 1001 - MedSupply Pro
  { shipmentBatchId: 1001, GTIN: 1234567890123, cost: 4500, itemName: "IV Saline Bag 500mL", supplierName: "MedSupply Pro" },
  { shipmentBatchId: 1001, GTIN: 1234567890123, cost: 3200, itemName: "IV Saline Bag 1000mL", supplierName: "MedSupply Pro" },
  // Batch 1002 - HealthCare Direct
  { shipmentBatchId: 1002, GTIN: 2345678901234, cost: 1800, itemName: "Sterile Gauze Pads 4x4", supplierName: "HealthCare Direct" },
  { shipmentBatchId: 1002, GTIN: 3456789012345, cost: 950, itemName: "Adhesive Bandages Assorted", supplierName: "HealthCare Direct" },
  // Batch 1003 - PharmaChoice Inc.
  { shipmentBatchId: 1003, GTIN: 4567890123456, cost: 6200, itemName: "Acetaminophen 500mg", supplierName: "PharmaChoice Inc." },
  { shipmentBatchId: 1003, GTIN: 5678901234567, cost: 8900, itemName: "Amoxicillin 250mg", supplierName: "PharmaChoice Inc." },
  // Batch 1004 - SurgicalTech International
  { shipmentBatchId: 1004, GTIN: 6789012345678, cost: 3400, itemName: "Scalpel Blade #10", supplierName: "SurgicalTech International" },
  { shipmentBatchId: 1004, GTIN: 7890123456789, cost: 2800, itemName: "Tissue Forceps", supplierName: "SurgicalTech International" },
  // Batch 1005 - Global Med Distributors
  { shipmentBatchId: 1005, GTIN: 8901234567890, cost: 5600, itemName: "Nitrile Gloves - Large", supplierName: "Global Med Distributors" },
  { shipmentBatchId: 1005, GTIN: 9012345678901, cost: 1100, itemName: "Surgical Face Masks", supplierName: "Global Med Distributors" },
  // Batch 1006 - BioMed Solutions (lab supplies)
  { shipmentBatchId: 1006, GTIN: 1111111111111, cost: 2400, itemName: "Vacutainer Tube Red Top", supplierName: "BioMed Solutions" },
  { shipmentBatchId: 1006, GTIN: 2222222222222, cost: 2100, itemName: "Vacutainer Tube Lavender Top", supplierName: "BioMed Solutions" },
  { shipmentBatchId: 1006, GTIN: 3333333333333, cost: 1600, itemName: "Vacutainer Tube Blue Top", supplierName: "BioMed Solutions" },
  // Batch 1007 - RespireCare Ltd. (respiratory)
  { shipmentBatchId: 1007, GTIN: 4444444444444, cost: 7200, itemName: "Oxygen Mask - Adult", supplierName: "RespireCare Ltd." },
  { shipmentBatchId: 1007, GTIN: 5555555555555, cost: 4800, itemName: "Nebulizer Kit", supplierName: "RespireCare Ltd." },
  { shipmentBatchId: 1007, GTIN: 6666666666666, cost: 1900, itemName: "Oxygen Nasal Cannula", supplierName: "RespireCare Ltd." },
  { shipmentBatchId: 1007, GTIN: 7777777777777, cost: 3100, itemName: "BVM Resuscitator - Adult", supplierName: "RespireCare Ltd." },
  // Batch 1008 - CardioVasc Systems
  { shipmentBatchId: 1008, GTIN: 8888888888888, cost: 3500, itemName: "ECG Electrode 10-Pack", supplierName: "CardioVasc Systems" },
  { shipmentBatchId: 1008, GTIN: 9999999999999, cost: 1200, itemName: "ECG Paper 215mm", supplierName: "CardioVasc Systems" },
  { shipmentBatchId: 1008, GTIN: 1010101010101, cost: 8900, itemName: "Blood Pressure Cuff - Adult", supplierName: "CardioVasc Systems" },
  // Batch 1009 - NeoPediCare
  { shipmentBatchId: 1009, GTIN: 1112111211121, cost: 4500, itemName: "Neonatal Pulse Oximeter Probe", supplierName: "NeoPediCare" },
  { shipmentBatchId: 1009, GTIN: 1113111311131, cost: 2800, itemName: "Premature Diaper Size P1", supplierName: "NeoPediCare" },
  { shipmentBatchId: 1009, GTIN: 1114111411141, cost: 6100, itemName: "Umbilical Catheter Kit", supplierName: "NeoPediCare" },
  { shipmentBatchId: 1009, GTIN: 1115111511151, cost: 3300, itemName: "Neonatal Nasal CPAP Prongs", supplierName: "NeoPediCare" },
  // Batch 1010 - Diagnostic Pro Inc.
  { shipmentBatchId: 1010, GTIN: 1116111611161, cost: 4200, itemName: "Digital Thermometer", supplierName: "Diagnostic Pro Inc." },
  { shipmentBatchId: 1010, GTIN: 1117111711171, cost: 15000, itemName: "Stethoscope", supplierName: "Diagnostic Pro Inc." },
  { shipmentBatchId: 1010, GTIN: 1118111811181, cost: 6700, itemName: "Pulse Oximeter", supplierName: "Diagnostic Pro Inc." },
  // Batch 1011 - WoundCare Plus
  { shipmentBatchId: 1011, GTIN: 1119111911191, cost: 2200, itemName: "Non-Stick Pads 3x4", supplierName: "WoundCare Plus" },
  { shipmentBatchId: 1011, GTIN: 1120112011201, cost: 3800, itemName: "Hydrocolloid Dressing", supplierName: "WoundCare Plus" },
  { shipmentBatchId: 1011, GTIN: 1121112111211, cost: 2900, itemName: "Elastic Bandage 4 inch", supplierName: "WoundCare Plus" },
  { shipmentBatchId: 1011, GTIN: 1122112211221, cost: 1400, itemName: "Wound Cleanser Spray", supplierName: "WoundCare Plus" },
  { shipmentBatchId: 1011, GTIN: 1123112311231, cost: 5100, itemName: "Foam Dressing 3x3", supplierName: "WoundCare Plus" },
  // Batch 1012 - AnesthesiaDirect
  { shipmentBatchId: 1012, GTIN: 1124112411241, cost: 5600, itemName: "ET Tube 7.0mm", supplierName: "AnesthesiaDirect" },
  { shipmentBatchId: 1012, GTIN: 1125112511251, cost: 5600, itemName: "ET Tube 8.0mm", supplierName: "AnesthesiaDirect" },
  { shipmentBatchId: 1012, GTIN: 1126112611261, cost: 8400, itemName: "Laryngeal Mask Airway #4", supplierName: "AnesthesiaDirect" },
  { shipmentBatchId: 1012, GTIN: 1127112711271, cost: 3200, itemName: "Anesthesia Circuit", supplierName: "AnesthesiaDirect" },
  // Batch 1013 - UroMed Supply
  { shipmentBatchId: 1013, GTIN: 1128112811281, cost: 3600, itemName: "Foley Catheter 16FR", supplierName: "UroMed Supply" },
  { shipmentBatchId: 1013, GTIN: 1129112911291, cost: 3600, itemName: "Foley Catheter 18FR", supplierName: "UroMed Supply" },
  { shipmentBatchId: 1013, GTIN: 1130113011301, cost: 1900, itemName: "Urine Collection Bag 2L", supplierName: "UroMed Supply" },
  { shipmentBatchId: 1013, GTIN: 1131113111311, cost: 5200, itemName: "Intermittent Catheter 14FR", supplierName: "UroMed Supply" },
  // Batch 1014 - OrthoFit Implants
  { shipmentBatchId: 1014, GTIN: 1132113211321, cost: 4200, itemName: "Fiberglass Cast 2 inch", supplierName: "OrthoFit Implants" },
  { shipmentBatchId: 1014, GTIN: 1133113311331, cost: 5800, itemName: "Fiberglass Cast 4 inch", supplierName: "OrthoFit Implants" },
  { shipmentBatchId: 1014, GTIN: 1134113411341, cost: 7300, itemName: "Knee Immobilizer", supplierName: "OrthoFit Implants" },
  { shipmentBatchId: 1014, GTIN: 1135113511351, cost: 4800, itemName: "Walking Boot Cam Walker", supplierName: "OrthoFit Implants" },
  // Batch 1015 - SteriTech Labs
  { shipmentBatchId: 1015, GTIN: 1136113611361, cost: 800, itemName: "Alcohol Swab 70%", supplierName: "SteriTech Labs" },
  { shipmentBatchId: 1015, GTIN: 1137113711371, cost: 2600, itemName: "Chlorhexidine Solution 500mL", supplierName: "SteriTech Labs" },
  { shipmentBatchId: 1015, GTIN: 1138113811381, cost: 1500, itemName: "Hand Sanitizer Gel 1L", supplierName: "SteriTech Labs" },
  { shipmentBatchId: 1015, GTIN: 1139113911391, cost: 3400, itemName: "Sterilization Pouch 7x10", supplierName: "SteriTech Labs" },
  // Batch 1016 - Global Med Distributors (PPE restock)
  { shipmentBatchId: 1016, GTIN: 1140114011401, cost: 7200, itemName: "Nitrile Gloves - Medium", supplierName: "Global Med Distributors" },
  { shipmentBatchId: 1016, GTIN: 1141114111411, cost: 4500, itemName: "N95 Respirator Masks", supplierName: "Global Med Distributors" },
  { shipmentBatchId: 1016, GTIN: 1142114211421, cost: 2900, itemName: "Face Shield", supplierName: "Global Med Distributors" },
  { shipmentBatchId: 1016, GTIN: 1143114311431, cost: 3600, itemName: "Isolation Gown", supplierName: "Global Med Distributors" },
  // Batch 1017 - MedSupply Pro (IV restock)
  { shipmentBatchId: 1017, GTIN: 1144114411441, cost: 5100, itemName: "IV Tubing Set", supplierName: "MedSupply Pro" },
  { shipmentBatchId: 1017, GTIN: 1145114511451, cost: 3800, itemName: "Peripheral IV Catheter 22G", supplierName: "MedSupply Pro" },
  { shipmentBatchId: 1017, GTIN: 1146114611461, cost: 2800, itemName: "IV Start Kit", supplierName: "MedSupply Pro" },
  { shipmentBatchId: 1017, GTIN: 1147114711471, cost: 9200, itemName: "Central Line Kit", supplierName: "MedSupply Pro" },
  // Batch 1018 - PharmaChoice Inc. (medication restock)
  { shipmentBatchId: 1018, GTIN: 1148114811481, cost: 4300, itemName: "Ibuprofen 400mg", supplierName: "PharmaChoice Inc." },
  { shipmentBatchId: 1018, GTIN: 1149114911491, cost: 12500, itemName: "Epinephrine Auto-Injector", supplierName: "PharmaChoice Inc." },
  { shipmentBatchId: 1018, GTIN: 1150115011501, cost: 5600, itemName: "Salbutamol Inhaler", supplierName: "PharmaChoice Inc." },
  { shipmentBatchId: 1018, GTIN: 1151115111511, cost: 1800, itemName: "Lorazepam 2mg", supplierName: "PharmaChoice Inc." },
  // Batch 1019 - HealthCare Direct (wound care)
  { shipmentBatchId: 1019, GTIN: 1152115211521, cost: 1500, itemName: "Medical Tape 2 inch", supplierName: "HealthCare Direct" },
  { shipmentBatchId: 1019, GTIN: 1153115311531, cost: 4100, itemName: "Surgical Sponges", supplierName: "HealthCare Direct" },
  { shipmentBatchId: 1019, GTIN: 1154115411541, cost: 3300, itemName: "Alginate Dressing", supplierName: "HealthCare Direct" },
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
