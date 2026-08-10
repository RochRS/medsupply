import { db } from "../database.js";
import { categories } from "../schemas/schema.js";
import { eq } from "drizzle-orm";

/** icon = Hugeicons export name used by the frontend */
export const data = [
  {
    categoryName: "IV Supplies",
    categoryDescription: "Infusie zakken, slangen en katheters",
    icon: "DropletIcon",
  },
  {
    categoryName: "Wound Care",
    categoryDescription: "Verband, gaas en wondverzorging",
    icon: "BandageIcon",
  },
  {
    categoryName: "Surgical Instruments",
    categoryDescription: "Chirurgisch handgereedschap",
    icon: "ScissorIcon",
  },
  {
    categoryName: "Personal Protective Equipment",
    categoryDescription: "Handschoenen, maskers en jassen",
    icon: "Shield01Icon",
  },
  {
    categoryName: "Medications",
    categoryDescription: "Geneesmiddelen en farmaceutische producten",
    icon: "Medicine01Icon",
  },
  {
    categoryName: "Diagnostic Equipment",
    categoryDescription: "Meet- en diagnose-apparatuur",
    icon: "StethoscopeIcon",
  },
  {
    categoryName: "Respiratory",
    categoryDescription: "Zuurstof en ademhalingsmateriaal",
    icon: "WindPowerIcon",
  },
  {
    categoryName: "Emergency",
    categoryDescription: "Spoedmateriaal en acute zorg",
    icon: "AmbulanceIcon",
  },
  {
    categoryName: "Antibiotica",
    categoryDescription: "Antibacteriële medicatie",
    icon: "Medicine02Icon",
  },
  {
    categoryName: "Pijnstilling",
    categoryDescription: "Analgetica en koortswerende middelen",
    icon: "FavouriteIcon",
  },
];

export async function seed() {
  const existing = await db
    .select({
      id: categories.categoryId,
      name: categories.categoryName,
      icon: categories.icon,
    })
    .from(categories);

  const byName = new Map(existing.map((r) => [r.name, r]));
  let insertedCount = 0;
  let updatedCount = 0;

  for (const row of data) {
    const found = byName.get(row.categoryName);
    if (!found) {
      await db.insert(categories).values(row);
      insertedCount += 1;
      continue;
    }
    if (found.icon !== row.icon) {
      await db
        .update(categories)
        .set({
          icon: row.icon,
          categoryDescription: row.categoryDescription,
        })
        .where(eq(categories.categoryId, found.id));
      updatedCount += 1;
    }
  }

  console.log(
    `  ✓ categories: ${insertedCount} inserted, ${updatedCount} icons updated`,
  );
  return Array.from({ length: insertedCount });
}

const isMain = process.argv[1]?.includes("seed-categories");
if (isMain) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ seed-categories failed:", err);
      process.exit(1);
    });
}
