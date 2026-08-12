import { getRequestsForUser } from "./requests.service.js";

export type NurseNotification = {
  id: string;
  type: "ready_for_pickup";
  requestBatchId: number;
  title: string;
  message: string;
  productCount: number;
  totalUnits: number;
  productsSummary: string;
  isUrgent: boolean;
  createdAt: string;
};

function batchStatus(
  items: Awaited<ReturnType<typeof getRequestsForUser>>,
): "open" | "approved" | "completed" {
  const statuses = items.map((i) => i.status);
  if (statuses.every((s) => s === "completed")) return "completed";
  if (statuses.some((s) => s === "open")) return "open";
  if (statuses.some((s) => s === "approved")) return "approved";
  return "completed";
}

/** Approved batches for verpleging — ready for pickup notifications. */
export async function getNurseNotifications(
  userId: string,
): Promise<NurseNotification[]> {
  const rows = await getRequestsForUser(userId);
  const byBatch = new Map<number, typeof rows>();

  for (const row of rows) {
    const list = byBatch.get(row.requestBatchId) ?? [];
    list.push(row);
    byBatch.set(row.requestBatchId, list);
  }

  const notifications: NurseNotification[] = [];

  for (const [requestBatchId, items] of byBatch) {
    if (batchStatus(items) !== "approved") continue;

    items.sort((a, b) => a.requestId - b.requestId);
    const productCount = items.length;
    const totalUnits = items.reduce((n, i) => n + i.requestedAmount, 0);
    const productsSummary = items
      .map((i) => `${i.itemName ?? "Product"} ×${i.requestedAmount}`)
      .join(", ");

    const latestUpdate = items.reduce((max, i) => {
      const t = i.updatedAt ? new Date(i.updatedAt).getTime() : 0;
      return Math.max(max, t);
    }, 0);

    notifications.push({
      id: `${requestBatchId}-ready`,
      type: "ready_for_pickup",
      requestBatchId,
      title: "Klaar voor ophalen",
      message:
        productCount === 1
          ? `${items[0]?.itemName ?? "Product"} is goedgekeurd — je mag het ophalen bij de apotheek.`
          : `${productCount} producten (${totalUnits} stuks) zijn goedgekeurd — je mag ze ophalen bij de apotheek.`,
      productCount,
      totalUnits,
      productsSummary,
      isUrgent: items.some((i) => i.isUrgent),
      createdAt: latestUpdate
        ? new Date(latestUpdate).toISOString()
        : new Date().toISOString(),
    });
  }

  return notifications.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
