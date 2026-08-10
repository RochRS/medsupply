import { db } from "../database.js";
import { request, items, requestDescription } from "../schemas/schema.js";
import { user } from "../schemas/auth-schema.js";

export const data = [
  { requestBatchId: 5001, requestedAmount: 100, isUrgent: true, isCompleted: true, itemName: "IV Saline Bag 500mL", userEmail: "apotheker@medsupply.com", descriptionField: "Urgent: Low stock alert — immediate replenishment needed within 24 hours" },
  { requestBatchId: 5001, requestedAmount: 50, isUrgent: true, isCompleted: true, itemName: "Peripheral IV Catheter 22G", userEmail: "apotheker@medsupply.com", descriptionField: "Urgent: Low stock alert — immediate replenishment needed within 24 hours" },
  { requestBatchId: 5002, requestedAmount: 200, isUrgent: false, isCompleted: true, itemName: "Nitrile Gloves - Large", userEmail: "verpleging@medsupply.com", descriptionField: "Routine restock — standard monthly inventory replenishment" },
  { requestBatchId: 5002, requestedAmount: 150, isUrgent: false, isCompleted: false, itemName: "Surgical Face Masks", userEmail: "verpleging@medsupply.com", descriptionField: "Routine restock — standard monthly inventory replenishment" },
  { requestBatchId: 5003, requestedAmount: 25, isUrgent: true, isCompleted: false, itemName: "Tissue Forceps", userEmail: "apotheker@medsupply.com", descriptionField: "Emergency order — unexpected surge in patient intake, critical shortage" },
  { requestBatchId: 5003, requestedAmount: 30, isUrgent: true, isCompleted: false, itemName: "Scalpel Blade #10", userEmail: "apotheker@medsupply.com", descriptionField: "Emergency order — unexpected surge in patient intake, critical shortage" },
  { requestBatchId: 5003, requestedAmount: 10, isUrgent: true, isCompleted: false, itemName: "Surgical Scissors", userEmail: "apotheker@medsupply.com", descriptionField: "Emergency order — unexpected surge in patient intake, critical shortage" },
  { requestBatchId: 5004, requestedAmount: 300, isUrgent: false, isCompleted: false, itemName: "N95 Respirator Masks", userEmail: "verpleging@medsupply.com", descriptionField: "Replacement for expired inventory — batch EOL items being swapped out" },
  { requestBatchId: 5005, requestedAmount: 80, isUrgent: false, isCompleted: true, itemName: "Nebulizer Kit", userEmail: "admin@medsupply.com", descriptionField: "New department request — establishing new ward, initial stock required" },
  { requestBatchId: 5005, requestedAmount: 20, isUrgent: false, isCompleted: true, itemName: "Oxygen Mask - Adult", userEmail: "admin@medsupply.com", descriptionField: "New department request — establishing new ward, initial stock required" },
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
  const toInsert = data.map((d) => ({
    requestBatchId: d.requestBatchId,
    requestedAmount: d.requestedAmount,
    isUrgent: d.isUrgent,
    isCompleted: d.isCompleted,
    status: d.isCompleted ? ("completed" as const) : ("open" as const),
    itemId: itemMap.get(d.itemName),
    userId: userMap.get(d.userEmail),
    requestDescriptionId: descMap.get(d.descriptionField),
  })).filter((d) => d.itemId != null && d.userId != null && d.requestDescriptionId != null && !existingKeys.has(`${d.requestBatchId}-${d.itemId}`));
  if (toInsert.length === 0) { console.log(`  ∼ requests: all ${data.length} already exist`); return []; }
  const inserted = await db.insert(request).values(toInsert).returning();
  console.log(`  ✓ requests: ${inserted.length} inserted (${data.length - inserted.length} already existed)`);
  return inserted;
}

const isMain = process.argv[1]?.includes("seed-requests");
if (isMain) { seed().then(() => process.exit(0)).catch((err) => { console.error("❌ seed-requests failed:", err); process.exit(1); }); }
