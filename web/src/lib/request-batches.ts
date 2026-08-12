import {
  requestStatusOf,
  type RequestDetail,
  type RequestStatus,
} from "../components/requests/request-detail-dialog";

export type RequestBatch = {
  requestBatchId: number;
  items: RequestDetail[];
  isUrgent: boolean;
  requestDescription: string | null;
  requesterName: string | null;
  requesterEmail: string | null;
  createdAt: string | null;
  status: RequestStatus;
  productCount: number;
  totalUnits: number;
  hasStockIssue: boolean;
};

export function batchStatusOf(items: RequestDetail[]): RequestStatus {
  const statuses = items.map(requestStatusOf);
  if (statuses.every((s) => s === "completed")) return "completed";
  if (statuses.some((s) => s === "open")) return "open";
  if (statuses.some((s) => s === "approved")) return "approved";
  return "completed";
}

export function groupRequestsByBatch(requests: RequestDetail[]): RequestBatch[] {
  const map = new Map<number, RequestDetail[]>();

  for (const row of requests) {
    const list = map.get(row.requestBatchId) ?? [];
    list.push(row);
    map.set(row.requestBatchId, list);
  }

  const batches: RequestBatch[] = [];

  for (const [requestBatchId, items] of map) {
    items.sort((a, b) => a.requestId - b.requestId);
    const head = items[0]!;
    batches.push({
      requestBatchId,
      items,
      isUrgent: items.some((i) => i.isUrgent),
      requestDescription: head.requestDescription,
      requesterName: head.requesterName,
      requesterEmail: head.requesterEmail ?? null,
      createdAt: head.createdAt,
      status: batchStatusOf(items),
      productCount: items.length,
      totalUnits: items.reduce((n, i) => n + i.requestedAmount, 0),
      hasStockIssue: items.some(
        (i) => requestStatusOf(i) === "open" && !(i.stockSufficient ?? true),
      ),
    });
  }

  return batches.sort((a, b) => {
    const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return tb - ta;
  });
}

export function formatBatchTitle(batch: RequestBatch): string {
  if (batch.productCount === 1) {
    const item = batch.items[0]!;
    return item.itemName ?? "Onbekend product";
  }
  return `Aanvraag · ${batch.productCount} producten`;
}

export function formatBatchProducts(batch: RequestBatch): string {
  return batch.items
    .map((i) => `${i.itemName ?? "Product"} ×${i.requestedAmount}`)
    .join(", ");
}
