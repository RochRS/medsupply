import { db } from "../database.js";
import { request, items, requestDescription } from "../schemas/schema.js";
import { user } from "../schemas/auth-schema.js";

export const data = [
  // Batch 5001 - Urgent ER restock
  { requestBatchId: 5001, requestedAmount: 100, isUrgent: true, isCompleted: true, itemName: "IV Saline Bag 500mL", userEmail: "sarah.johnson@medsupply.com", descriptionField: "Urgent: Low stock alert — immediate replenishment needed within 24 hours" },
  { requestBatchId: 5001, requestedAmount: 50, isUrgent: true, isCompleted: true, itemName: "Peripheral IV Catheter 22G", userEmail: "sarah.johnson@medsupply.com", descriptionField: "Urgent: Low stock alert — immediate replenishment needed within 24 hours" },
  // Batch 5002 - Routine monthly restock
  { requestBatchId: 5002, requestedAmount: 200, isUrgent: false, isCompleted: true, itemName: "Nitrile Gloves - Large", userEmail: "emily.rodriguez@medsupply.com", descriptionField: "Routine restock — standard monthly inventory replenishment" },
  { requestBatchId: 5002, requestedAmount: 150, isUrgent: false, isCompleted: false, itemName: "Surgical Face Masks", userEmail: "emily.rodriguez@medsupply.com", descriptionField: "Routine restock — standard monthly inventory replenishment" },
  // Batch 5003 - Emergency surgery order
  { requestBatchId: 5003, requestedAmount: 25, isUrgent: true, isCompleted: false, itemName: "Tissue Forceps", userEmail: "michael.chen@medsupply.com", descriptionField: "Emergency order — unexpected surge in patient intake, critical shortage" },
  { requestBatchId: 5003, requestedAmount: 30, isUrgent: true, isCompleted: false, itemName: "Scalpel Blade #10", userEmail: "michael.chen@medsupply.com", descriptionField: "Emergency order — unexpected surge in patient intake, critical shortage" },
  { requestBatchId: 5003, requestedAmount: 10, isUrgent: true, isCompleted: false, itemName: "Surgical Scissors", userEmail: "michael.chen@medsupply.com", descriptionField: "Emergency order — unexpected surge in patient intake, critical shortage" },
  // Batch 5004 - Expired inventory replacement
  { requestBatchId: 5004, requestedAmount: 300, isUrgent: false, isCompleted: false, itemName: "N95 Respirator Masks", userEmail: "james.wilson@medsupply.com", descriptionField: "Replacement for expired inventory — batch EOL items being swapped out" },
  // Batch 5005 - New ward setup
  { requestBatchId: 5005, requestedAmount: 80, isUrgent: false, isCompleted: true, itemName: "Nebulizer Kit", userEmail: "lisa.thompson@medsupply.com", descriptionField: "New department request — establishing new ward, initial stock required" },
  { requestBatchId: 5005, requestedAmount: 20, isUrgent: false, isCompleted: true, itemName: "Oxygen Mask - Adult", userEmail: "lisa.thompson@medsupply.com", descriptionField: "New department request — establishing new ward, initial stock required" },
  // Batch 5006 - ICU seasonal surge
  { requestBatchId: 5006, requestedAmount: 60, isUrgent: true, isCompleted: true, itemName: "IV Tubing Set", userEmail: "robert.patel@medsupply.com", descriptionField: "Seasonal demand increase — preparing for flu season patient surge" },
  { requestBatchId: 5006, requestedAmount: 40, isUrgent: true, isCompleted: true, itemName: "IV Start Kit", userEmail: "robert.patel@medsupply.com", descriptionField: "Seasonal demand increase — preparing for flu season patient surge" },
  { requestBatchId: 5006, requestedAmount: 25, isUrgent: true, isCompleted: true, itemName: "Central Line Kit", userEmail: "robert.patel@medsupply.com", descriptionField: "Seasonal demand increase — preparing for flu season patient surge" },
  // Batch 5007 - Backorder fulfillment
  { requestBatchId: 5007, requestedAmount: 100, isUrgent: false, isCompleted: false, itemName: "Sterile Gauze Pads 4x4", userEmail: "amanda.foster@medsupply.com", descriptionField: "Backorder fulfillment — previously delayed items now being ordered" },
  { requestBatchId: 5007, requestedAmount: 50, isUrgent: false, isCompleted: false, itemName: "Non-Stick Pads 3x4", userEmail: "amanda.foster@medsupply.com", descriptionField: "Backorder fulfillment — previously delayed items now being ordered" },
  { requestBatchId: 5007, requestedAmount: 30, isUrgent: false, isCompleted: false, itemName: "Hydrocolloid Dressing", userEmail: "amanda.foster@medsupply.com", descriptionField: "Backorder fulfillment — previously delayed items now being ordered" },
  // Batch 5008 - Clinical trial supplies
  { requestBatchId: 5008, requestedAmount: 200, isUrgent: false, isCompleted: false, itemName: "Vacutainer Tube Lavender Top", userEmail: "yuki.tanaka@medsupply.com", descriptionField: "Clinical trial supplies — specialized items for ongoing research study" },
  { requestBatchId: 5008, requestedAmount: 150, isUrgent: false, isCompleted: false, itemName: "Vacutainer Tube Red Top", userEmail: "yuki.tanaka@medsupply.com", descriptionField: "Clinical trial supplies — specialized items for ongoing research study" },
  { requestBatchId: 5008, requestedAmount: 50, isUrgent: false, isCompleted: false, itemName: "Blood Culture Bottle Set", userEmail: "yuki.tanaka@medsupply.com", descriptionField: "Clinical trial supplies — specialized items for ongoing research study" },
  // Batch 5009 - Compliance update
  { requestBatchId: 5009, requestedAmount: 500, isUrgent: false, isCompleted: true, itemName: "Alcohol Swab 70%", userEmail: "priya.sharma@medsupply.com", descriptionField: "Regulatory compliance update — replacing items with updated specifications" },
  { requestBatchId: 5009, requestedAmount: 75, isUrgent: false, isCompleted: true, itemName: "Chlorhexidine Solution 500mL", userEmail: "priya.sharma@medsupply.com", descriptionField: "Regulatory compliance update — replacing items with updated specifications" },
  // Batch 5010 - Equipment maintenance
  { requestBatchId: 5010, requestedAmount: 5, isUrgent: false, isCompleted: false, itemName: "Electrocautery Pen", userEmail: "david.kim@medsupply.com", descriptionField: "Equipment maintenance — replacement parts for scheduled repairs" },
  { requestBatchId: 5010, requestedAmount: 10, isUrgent: false, isCompleted: false, itemName: "Laryngoscope Blade Mac 3", userEmail: "david.kim@medsupply.com", descriptionField: "Equipment maintenance — replacement parts for scheduled repairs" },
  // Batch 5011 - Budget surplus spend
  { requestBatchId: 5011, requestedAmount: 300, isUrgent: false, isCompleted: true, itemName: "Nitrile Gloves - Medium", userEmail: "olivia.martinez@medsupply.com", descriptionField: "Budget surplus allocation — utilizing remaining yearly budget on essential stock" },
  { requestBatchId: 5011, requestedAmount: 100, isUrgent: false, isCompleted: true, itemName: "Isolation Gown", userEmail: "olivia.martinez@medsupply.com", descriptionField: "Budget surplus allocation — utilizing remaining yearly budget on essential stock" },
  { requestBatchId: 5011, requestedAmount: 200, isUrgent: false, isCompleted: true, itemName: "Surgical Cap Bouffant", userEmail: "olivia.martinez@medsupply.com", descriptionField: "Budget surplus allocation — utilizing remaining yearly budget on essential stock" },
  // Batch 5012 - Disaster preparedness
  { requestBatchId: 5012, requestedAmount: 50, isUrgent: true, isCompleted: false, itemName: "Emergency Blanket", userEmail: "benjamin.okafor@medsupply.com", descriptionField: "Disaster preparedness — FEMA-mandated stockpile replenishment" },
  { requestBatchId: 5012, requestedAmount: 20, isUrgent: true, isCompleted: false, itemName: "Cervical Collar - Adult", userEmail: "benjamin.okafor@medsupply.com", descriptionField: "Disaster preparedness — FEMA-mandated stockpile replenishment" },
  { requestBatchId: 5012, requestedAmount: 10, isUrgent: true, isCompleted: false, itemName: "Tourniquet - Combat Application", userEmail: "benjamin.okafor@medsupply.com", descriptionField: "Disaster preparedness — FEMA-mandated stockpile replenishment" },
  { requestBatchId: 5012, requestedAmount: 5, isUrgent: true, isCompleted: false, itemName: "Backboard Full Size", userEmail: "benjamin.okafor@medsupply.com", descriptionField: "Disaster preparedness — FEMA-mandated stockpile replenishment" },
  // Batch 5013 - Physician preference
  { requestBatchId: 5013, requestedAmount: 15, isUrgent: false, isCompleted: true, itemName: "Hemostatic Forceps", userEmail: "hassan.alrashid@medsupply.com", descriptionField: "Physician preference order — specific brand/model requested by attending physician" },
  { requestBatchId: 5013, requestedAmount: 8, isUrgent: false, isCompleted: true, itemName: "Needle Holder", userEmail: "hassan.alrashid@medsupply.com", descriptionField: "Physician preference order — specific brand/model requested by attending physician" },
  // Batch 5014 - Training sim supplies
  { requestBatchId: 5014, requestedAmount: 25, isUrgent: false, isCompleted: false, itemName: "BVM Resuscitator - Adult", userEmail: "sofia.lindstrom@medsupply.com", descriptionField: "Training and simulation — supplies for medical staff training exercises" },
  { requestBatchId: 5014, requestedAmount: 10, isUrgent: false, isCompleted: false, itemName: "Laryngeal Mask Airway #4", userEmail: "sofia.lindstrom@medsupply.com", descriptionField: "Training and simulation — supplies for medical staff training exercises" },
  { requestBatchId: 5014, requestedAmount: 15, isUrgent: false, isCompleted: false, itemName: "ET Tube 7.0mm", userEmail: "sofia.lindstrom@medsupply.com", descriptionField: "Training and simulation — supplies for medical staff training exercises" },
  // Batch 5015 - Patient-specific order
  { requestBatchId: 5015, requestedAmount: 4, isUrgent: true, isCompleted: false, itemName: "Tracheostomy Tube 6.0", userEmail: "william.brooks@medsupply.com", descriptionField: "Patient-specific order — customized items for a specific patient's treatment plan" },
  { requestBatchId: 5015, requestedAmount: 1, isUrgent: true, isCompleted: false, itemName: "AICD Magnet", userEmail: "william.brooks@medsupply.com", descriptionField: "Patient-specific order — customized items for a specific patient's treatment plan" },
  // Batch 5016 - Oncology restock
  { requestBatchId: 5016, requestedAmount: 40, isUrgent: false, isCompleted: true, itemName: "Foley Catheter 16FR", userEmail: "maria.gonzalez@medsupply.com", descriptionField: "Routine restock — standard monthly inventory replenishment" },
  { requestBatchId: 5016, requestedAmount: 30, isUrgent: false, isCompleted: true, itemName: "Urine Collection Bag 2L", userEmail: "maria.gonzalez@medsupply.com", descriptionField: "Routine restock — standard monthly inventory replenishment" },
  // Batch 5017 - Cardiology dept surge
  { requestBatchId: 5017, requestedAmount: 200, isUrgent: true, isCompleted: false, itemName: "ECG Electrode 10-Pack", userEmail: "ahmed.hassan@medsupply.com", descriptionField: "Emergency order — unexpected surge in patient intake, critical shortage" },
  { requestBatchId: 5017, requestedAmount: 15, isUrgent: true, isCompleted: false, itemName: "ECG Paper 215mm", userEmail: "ahmed.hassan@medsupply.com", descriptionField: "Emergency order — unexpected surge in patient intake, critical shortage" },
  // Batch 5018 - Radiology dept
  { requestBatchId: 5018, requestedAmount: 10, isUrgent: false, isCompleted: false, itemName: "X-Ray Film 14x17", userEmail: "leila.dupont@medsupply.com", descriptionField: "Replacement for expired inventory — batch EOL items being swapped out" },
  { requestBatchId: 5018, requestedAmount: 25, isUrgent: false, isCompleted: false, itemName: "Ultrasound Gel 250mL", userEmail: "leila.dupont@medsupply.com", descriptionField: "Replacement for expired inventory — batch EOL items being swapped out" },
  // Batch 5019 - Pharmacy restock
  { requestBatchId: 5019, requestedAmount: 100, isUrgent: false, isCompleted: true, itemName: "Acetaminophen 500mg", userEmail: "katherine.lee@medsupply.com", descriptionField: "Routine restock — standard monthly inventory replenishment" },
  { requestBatchId: 5019, requestedAmount: 60, isUrgent: false, isCompleted: true, itemName: "Ibuprofen 400mg", userEmail: "katherine.lee@medsupply.com", descriptionField: "Routine restock — standard monthly inventory replenishment" },
  { requestBatchId: 5019, requestedAmount: 30, isUrgent: false, isCompleted: true, itemName: "Amoxicillin 250mg", userEmail: "katherine.lee@medsupply.com", descriptionField: "Routine restock — standard monthly inventory replenishment" },
  { requestBatchId: 5019, requestedAmount: 20, isUrgent: false, isCompleted: true, itemName: "Epinephrine Auto-Injector", userEmail: "katherine.lee@medsupply.com", descriptionField: "Routine restock — standard monthly inventory replenishment" },
  // Batch 5020 - NICU order
  { requestBatchId: 5020, requestedAmount: 50, isUrgent: true, isCompleted: false, itemName: "Neonatal Pulse Oximeter Probe", userEmail: "carlos.mendez@medsupply.com", descriptionField: "New department request — establishing new ward, initial stock required" },
  { requestBatchId: 5020, requestedAmount: 80, isUrgent: true, isCompleted: false, itemName: "Premature Diaper Size P1", userEmail: "carlos.mendez@medsupply.com", descriptionField: "New department request — establishing new ward, initial stock required" },
  { requestBatchId: 5020, requestedAmount: 5, isUrgent: true, isCompleted: false, itemName: "Umbilical Catheter Kit", userEmail: "carlos.mendez@medsupply.com", descriptionField: "New department request — establishing new ward, initial stock required" },
];

export async function seed() {
  const itemRows = await db.select({ name: items.itemName, id: items.itemId }).from(items);
  const itemMap = new Map(itemRows.map((r) => [r.name, r.id]));
  const userRows = await db.select({ email: user.email, id: user.id }).from(user);
  const userMap = new Map(userRows.map((r) => [r.email, r.id]));
  const descRows = await db.select({ field: requestDescription.requestDescriptionField, id: requestDescription.requestDescriptionId }).from(requestDescription);
  const descMap = new Map(descRows.map((r) => [r.field, r.id]));
  const existing = await db.select({ batchId: request.requestBatchId, itemId: request.itemId }).from(request);
  const existingKeys = new Set(existing.map((r) => `${r.batchId}-${r.itemId}`));
  const toInsert = data.map((d) => ({ requestBatchId: d.requestBatchId, requestedAmount: d.requestedAmount, isUrgent: d.isUrgent, isCompleted: d.isCompleted, itemId: itemMap.get(d.itemName), userId: userMap.get(d.userEmail), requestDescriptionId: descMap.get(d.descriptionField) })).filter((d) => d.itemId != null && d.userId != null && d.requestDescriptionId != null && !existingKeys.has(`${d.requestBatchId}-${d.itemId}`));
  if (toInsert.length === 0) { console.log(`  ∼ requests: all ${data.length} already exist`); return []; }
  const inserted = await db.insert(request).values(toInsert).returning();
  console.log(`  ✓ requests: ${inserted.length} inserted (${data.length - inserted.length} already existed)`);
  return inserted;
}

const isMain = process.argv[1]?.includes("seed-requests");
if (isMain) { seed().then(() => process.exit(0)).catch((err) => { console.error("❌ seed-requests failed:", err); process.exit(1); }); }
