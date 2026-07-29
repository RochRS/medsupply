import { db } from "../database.js";
import { suppliers } from "../schemas/schema.js";

export const data = [
  { supplierName: "MedSupply Pro", address: "123 Health Blvd, Suite 400, New York, NY 10001", description: "Leading distributor of hospital-grade medical supplies", contactInfo: "contact@medsupplypro.com | (800) 555-0101" },
  { supplierName: "HealthCare Direct", address: "456 Wellness Ave, Chicago, IL 60601", description: "Full-service medical equipment and pharmaceutical supplier", contactInfo: "orders@healthcaredirect.com | (800) 555-0102" },
  { supplierName: "PharmaChoice Inc.", address: "789 Medicine Ln, Dallas, TX 75201", description: "Pharmaceutical and medication wholesale distributor", contactInfo: "sales@pharmachoice.com | (800) 555-0103" },
  { supplierName: "SurgicalTech International", address: "321 Surgeon Way, Boston, MA 02101", description: "Premium surgical instrument manufacturer and supplier", contactInfo: "info@surgicaltech.com | (800) 555-0104" },
  { supplierName: "Global Med Distributors", address: "555 Supply Chain Dr, Atlanta, GA 30301", description: "International medical supply chain and logistics provider", contactInfo: "support@globalmeddist.com | (800) 555-0105" },
  { supplierName: "BioMed Solutions", address: "777 Research Blvd, San Diego, CA 92101", description: "Biotechnology and laboratory equipment supplier", contactInfo: "sales@biomedsolutions.com | (800) 555-0106" },
  { supplierName: "RespireCare Ltd.", address: "200 Oxygen Way, Denver, CO 80201", description: "Specialist in respiratory therapy and pulmonary equipment", contactInfo: "orders@respirecare.com | (800) 555-0107" },
  { supplierName: "CardioVasc Systems", address: "150 Heartbeat Dr, Cleveland, OH 44101", description: "Cardiovascular device manufacturer and distributor", contactInfo: "info@cardiovasc.com | (800) 555-0108" },
  { supplierName: "NeoPediCare", address: "89 Tiny Tots Ave, Philadelphia, PA 19101", description: "Neonatal and pediatric medical supplies specialist", contactInfo: "support@neopedicare.com | (800) 555-0109" },
  { supplierName: "Diagnostic Pro Inc.", address: "12 Scan Rd, Seattle, WA 98101", description: "Diagnostic imaging and laboratory equipment provider", contactInfo: "sales@diagnosticpro.com | (800) 555-0110" },
  { supplierName: "WoundCare Plus", address: "34 Heal St, Miami, FL 33101", description: "Advanced wound care and dressing materials supplier", contactInfo: "orders@woundcareplus.com | (800) 555-0111" },
  { supplierName: "AnesthesiaDirect", address: "67 Sleep Ln, Portland, OR 97201", description: "Anesthesia equipment and pharmaceutical supplier", contactInfo: "info@anesthesiadirect.com | (800) 555-0112" },
  { supplierName: "UroMed Supply", address: "90 Bladder Rd, Phoenix, AZ 85001", description: "Urological products and catheter specialist", contactInfo: "support@uromed.com | (800) 555-0113" },
  { supplierName: "OrthoFit Implants", address: "45 Bone Dr, Indianapolis, IN 46201", description: "Orthopedic implants and surgical instrument manufacturer", contactInfo: "sales@orthofit.com | (800) 555-0114" },
  { supplierName: "SteriTech Labs", address: "201 Clean Room Ave, Raleigh, NC 27601", description: "Sterilization and infection control products", contactInfo: "orders@steritech.com | (800) 555-0115" },
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
