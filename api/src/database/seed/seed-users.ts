import { db } from "../database.js";
import { user } from "../schemas/auth-schema.js";

export const data = [
  { id: "usr_001", name: "Dr. Sarah Johnson", email: "sarah.johnson@medsupply.com", emailVerified: true },
  { id: "usr_002", name: "Dr. Michael Chen", email: "michael.chen@medsupply.com", emailVerified: true },
  { id: "usr_003", name: "Nurse Emily Rodriguez", email: "emily.rodriguez@medsupply.com", emailVerified: true },
  { id: "usr_004", name: "Nurse James Wilson", email: "james.wilson@medsupply.com", emailVerified: true },
  { id: "usr_005", name: "Admin Lisa Thompson", email: "lisa.thompson@medsupply.com", emailVerified: true },
  { id: "usr_006", name: "Dr. Robert Patel", email: "robert.patel@medsupply.com", emailVerified: true },
  { id: "usr_007", name: "Dr. Amanda Foster", email: "amanda.foster@medsupply.com", emailVerified: true },
  { id: "usr_008", name: "Nurse Carlos Mendez", email: "carlos.mendez@medsupply.com", emailVerified: true },
  { id: "usr_009", name: "Dr. Yuki Tanaka", email: "yuki.tanaka@medsupply.com", emailVerified: true },
  { id: "usr_010", name: "Nurse Priya Sharma", email: "priya.sharma@medsupply.com", emailVerified: true },
  { id: "usr_011", name: "Admin David Kim", email: "david.kim@medsupply.com", emailVerified: true },
  { id: "usr_012", name: "Dr. Olivia Martinez", email: "olivia.martinez@medsupply.com", emailVerified: true },
  { id: "usr_013", name: "Nurse Benjamin Okafor", email: "benjamin.okafor@medsupply.com", emailVerified: true },
  { id: "usr_014", name: "Dr. Hassan Al-Rashid", email: "hassan.alrashid@medsupply.com", emailVerified: true },
  { id: "usr_015", name: "Nurse Sofia Lindström", email: "sofia.lindstrom@medsupply.com", emailVerified: true },
  { id: "usr_016", name: "Dr. William Brooks", email: "william.brooks@medsupply.com", emailVerified: true },
  { id: "usr_017", name: "Admin Maria Gonzalez", email: "maria.gonzalez@medsupply.com", emailVerified: true },
  { id: "usr_018", name: "Dr. Ahmed Hassan", email: "ahmed.hassan@medsupply.com", emailVerified: true },
  { id: "usr_019", name: "Nurse Leila Dupont", email: "leila.dupont@medsupply.com", emailVerified: true },
  { id: "usr_020", name: "Dr. Katherine Lee", email: "katherine.lee@medsupply.com", emailVerified: true },
];

export async function seed() {
  const existing = await db.select({ email: user.email }).from(user);
  const existingEmails = new Set(existing.map((r) => r.email));
  const newData = data.filter((d) => !existingEmails.has(d.email));
  if (newData.length === 0) { console.log(`  ∼ users: all ${data.length} already exist`); return []; }
  const inserted = await db.insert(user).values(newData).returning();
  console.log(`  ✓ users: ${inserted.length} inserted (${data.length - inserted.length} already existed)`);
  return inserted;
}

const isMain = process.argv[1]?.includes("seed-users");
if (isMain) { seed().then(() => process.exit(0)).catch((err) => { console.error("❌ seed-users failed:", err); process.exit(1); }); }
