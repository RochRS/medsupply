import { eq } from "drizzle-orm";
import { db } from "../database/database.js";
import { appSettings } from "../database/schemas/schema.js";

export const DEFAULT_APP_NAME = "MedSupply";
const SETTINGS_ROW_ID = 1;

export async function getAppName(): Promise<string> {
  const [row] = await db
    .select({ appName: appSettings.appName })
    .from(appSettings)
    .where(eq(appSettings.id, SETTINGS_ROW_ID))
    .limit(1);

  if (row) return row.appName;

  const [created] = await db
    .insert(appSettings)
    .values({ id: SETTINGS_ROW_ID, appName: DEFAULT_APP_NAME })
    .onConflictDoNothing()
    .returning({ appName: appSettings.appName });

  return created?.appName ?? DEFAULT_APP_NAME;
}

export async function setAppName(appName: string): Promise<string> {
  const [updated] = await db
    .insert(appSettings)
    .values({ id: SETTINGS_ROW_ID, appName, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: appSettings.id,
      set: { appName, updatedAt: new Date() },
    })
    .returning({ appName: appSettings.appName });

  return updated!.appName;
}
