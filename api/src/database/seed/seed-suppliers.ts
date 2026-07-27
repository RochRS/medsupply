import { db } from "../database.js";
import { suppliers } from "../schemas/schema.js";

export const data = [
  { supplierName: "MedSupply Pro", address: "123 Health Blvd, Suite 400, New York, NY 10001", description: "Leading distributor of hospital-grade medical supplies", contactInfo: "contact@medsupplypro.com | (800) 555-0101" },
  { supplierName: "HealthCare Direct", address: "456 Wellness Ave, Chicago, IL 60601", description: "Full-service medical equipment and pharmaceutical supplier", contactInfo: "orders@healthcaredirect.com | (800) 555-0102" },
  { supplierName: "PharmaChoice Inc.", address: "789 Medicine Ln, Dallas, TX 75201", description: "Pharmaceutical and medication wholesale distributor", contactInfo: "sales@pharmachoice.com | (800) 555-0103" },
  { supplierName: "SurgicalTech International", address: "321 Surgeon Way, Boston, MA 02101", description: "Premium surgical instrument manufacturer and supplier", contactInfo: "info@surgicaltech.com | (800) 555-0104" },
  { supplierName: "Global Med Distributors", address: "555 Supply Chain Dr, Atlanta, GA 30301", description: "International medical supply chain and logistics provider", contactInfo: "support@globalmeddist.com | (800) 555-0105" },
];

export async function seed() {
  const existing = await db.select({ name: suppliers.supplierName }).from(suppliers);
  const existingNames = new Set(existing.map((r) => r.name));
  const newData = data.filter((d) => !existingNames.has(d.supplierName));
  if (newData.length === 0) { console.log(`  ∼ suppliers: all ${data.length} already exist`); return []; }
  const inserted = await db.insert(suppliers).values(newData).returning();
  console.log(`  ✓ suppliers: ${inserted.length} inserted (${data.length - inserted.length} already existed)`);
  return inserted;
}

const isMain = process.argv[1]?.includes("seed-suppliers");
if (isMain) { seed().then(() => process.exit(0)).catch((err) => { console.error("❌ seed-suppliers failed:", err); process.exit(1); }); }
