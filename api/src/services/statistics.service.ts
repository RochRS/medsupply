import { asc, desc, eq, sql } from "drizzle-orm";
import { db } from "../database/database.js";
import {
  items as itemsTable,
  categories,
  request,
} from "../database/schemas/schema.js";
import { getAllItems, stockLevel } from "./items.service.js";

export type UsagePeriod = "daily" | "monthly" | "yearly";

function daysBetween(from: Date, to: Date) {
  return Math.max(0, (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

function periodKey(date: Date, period: UsagePeriod): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  if (period === "yearly") return String(y);
  if (period === "monthly") return `${y}-${m}`;
  return `${y}-${m}-${d}`;
}

function periodLabel(key: string, period: UsagePeriod): string {
  if (period === "yearly") return key;
  if (period === "monthly") {
    const [y, m] = key.split("-");
    const monthNames = [
      "jan",
      "feb",
      "mrt",
      "apr",
      "mei",
      "jun",
      "jul",
      "aug",
      "sep",
      "okt",
      "nov",
      "dec",
    ];
    const idx = Number(m) - 1;
    return `${monthNames[idx] ?? m} ${y}`;
  }
  const [y, m, d] = key.split("-");
  return `${d}-${m}-${y}`;
}

export async function getStatisticsOverview(period: UsagePeriod = "daily") {
  const now = new Date();

  const [inventory, categoryRows, requestRows, usageByCategory] =
    await Promise.all([
      getAllItems(),
      db
        .select({
          categoryId: categories.categoryId,
          categoryName: categories.categoryName,
          itemCount: sql<number>`count(${itemsTable.itemId})::int`,
        })
        .from(categories)
        .leftJoin(itemsTable, eq(itemsTable.categoryId, categories.categoryId))
        .groupBy(categories.categoryId, categories.categoryName)
        .orderBy(desc(sql`count(${itemsTable.itemId})`)),
      db
        .select({
          requestId: request.requestId,
          requestedAmount: request.requestedAmount,
          createdAt: request.createdAt,
          itemId: request.itemId,
        })
        .from(request)
        .orderBy(asc(request.createdAt)),
      db
        .select({
          categoryId: categories.categoryId,
          categoryName: categories.categoryName,
          totalRequested: sql<number>`coalesce(sum(${request.requestedAmount}), 0)::int`,
        })
        .from(request)
        .innerJoin(itemsTable, eq(request.itemId, itemsTable.itemId))
        .innerJoin(
          categories,
          eq(itemsTable.categoryId, categories.categoryId),
        )
        .groupBy(categories.categoryId, categories.categoryName)
        .orderBy(desc(sql`sum(${request.requestedAmount})`)),
    ]);

  const kritiek = inventory.summary.criticalStock;
  const laag = inventory.summary.lowStock;
  const totaal = inventory.summary.totalItems;
  const goed = Math.max(0, totaal - kritiek - laag);

  // Average storage time (days since item created)
  const storageDays = inventory.items
    .map((item) => {
      if (!item.createdAt) return null;
      return daysBetween(new Date(item.createdAt), now);
    })
    .filter((d): d is number => d != null);

  const avgStorageDays =
    storageDays.length > 0
      ? Math.round(
          (storageDays.reduce((a, b) => a + b, 0) / storageDays.length) * 10,
        ) / 10
      : 0;

  // Average daily usage from request amounts
  const requestDates = requestRows
    .map((r) => r.createdAt)
    .filter((d): d is Date => d != null)
    .map((d) => new Date(d).getTime());

  let avgDailyUsage = 0;
  if (requestRows.length > 0 && requestDates.length > 0) {
    const totalRequested = requestRows.reduce(
      (sum, r) => sum + (r.requestedAmount ?? 0),
      0,
    );
    const spanDays = Math.max(
      1,
      daysBetween(new Date(Math.min(...requestDates)), now),
    );
    avgDailyUsage = Math.round((totalRequested / spanDays) * 10) / 10;
  }

  const topCategory = usageByCategory[0]?.categoryName ?? null;

  // Usage series for chart
  const bucket = new Map<string, number>();
  for (const row of requestRows) {
    if (!row.createdAt) continue;
    const key = periodKey(new Date(row.createdAt), period);
    bucket.set(key, (bucket.get(key) ?? 0) + (row.requestedAmount ?? 0));
  }

  // Fill recent empty buckets for nicer charts; if recent window is empty, show days that have data
  const seriesKeys: string[] = [];
  if (period === "daily") {
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      seriesKeys.push(periodKey(d, "daily"));
    }
  } else if (period === "monthly") {
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      seriesKeys.push(periodKey(d, "monthly"));
    }
  } else {
    const year = now.getFullYear();
    for (let y = year - 4; y <= year; y++) {
      seriesKeys.push(String(y));
    }
  }

  const recentHasData = seriesKeys.some((key) => (bucket.get(key) ?? 0) > 0);
  const keysForChart =
    recentHasData || bucket.size === 0
      ? seriesKeys
      : [...bucket.keys()].sort().slice(-14);

  const usageSeries = keysForChart.map((key) => ({
    key,
    label: periodLabel(key, period),
    amount: bucket.get(key) ?? 0,
  }));

  // Per-item stock levels (top 20 by remaining, then rest sorted low first for attention)
  const itemLevels = [...inventory.items]
    .sort((a, b) => a.remainingAmount - b.remainingAmount)
    .slice(0, 24)
    .map((item) => ({
      itemId: item.itemId,
      itemName: item.itemName,
      remainingAmount: item.remainingAmount,
      stockLevel: stockLevel(item.remainingAmount),
      categoryName: item.categoryName,
      storageDays: item.createdAt
        ? Math.round(daysBetween(new Date(item.createdAt), now))
        : null,
    }));

  const storageByItem = [...inventory.items]
    .map((item) => ({
      itemId: item.itemId,
      itemName: item.itemName,
      storageDays: item.createdAt
        ? Math.round(daysBetween(new Date(item.createdAt), now) * 10) / 10
        : 0,
    }))
    .sort((a, b) => b.storageDays - a.storageDays)
    .slice(0, 15);

  return {
    kpis: {
      avgDailyUsage,
      avgStorageDays,
      topCategory,
      totalItems: totaal,
      totalRequests: requestRows.length,
    },
    stockStatus: {
      kritiek,
      laag,
      goed,
      total: totaal,
    },
    categories: categoryRows.map((c) => ({
      categoryId: c.categoryId,
      categoryName: c.categoryName,
      itemCount: Number(c.itemCount ?? 0),
    })),
    itemLevels,
    usageSeries,
    usagePeriod: period,
    storageByItem,
  };
}
