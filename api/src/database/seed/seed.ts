import { seed as seedCategories } from "./seed-categories.js";
import { seed as seedSuppliers } from "./seed-suppliers.js";
import { seed as seedDepartments } from "./seed-departments.js";
import { seed as seedUsers } from "./seed-users.js";
import { seed as seedRequestDescriptions } from "./seed-request-descriptions.js";
import { seed as seedItems } from "./seed-items.js";
import { seed as seedShipments } from "./seed-shipments.js";
import { seed as seedRequests } from "./seed-requests.js";

async function seed() {
  console.log("🌱 Seeding database...\n");
  const results: { name: string; count: number }[] = [];
  const runners = [
    { name: "categories", fn: seedCategories },
    { name: "suppliers", fn: seedSuppliers },
    { name: "departments", fn: seedDepartments },
    { name: "users", fn: seedUsers },
    { name: "request descriptions", fn: seedRequestDescriptions },
    { name: "items", fn: seedItems },
    { name: "shipments", fn: seedShipments },
    { name: "requests", fn: seedRequests },
  ];
  for (const { name, fn } of runners) {
    const inserted = await fn();
    results.push({ name, count: inserted.length });
  }
  const total = results.reduce((sum, r) => sum + r.count, 0);
  console.log("\n─────────────────────────────────");
  console.log("  Seed complete!");
  console.log("─────────────────────────────────");
  for (const { name, count } of results) {
    console.log(`  ${name.padEnd(20)} : ${count}`);
  }
  console.log("─────────────────────────────────");
  console.log(`  Total new records  : ${total}`);
  console.log("─────────────────────────────────\n");
  process.exit(0);
}

seed().catch((err) => {
  console.error("\n❌ Seed failed:", err);
  process.exit(1);
});
