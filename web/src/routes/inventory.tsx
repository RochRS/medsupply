import { createFileRoute } from "@tanstack/react-router";
import { InventoryPage } from "../module/inventory-module.tsx";

export type InventorySearch = {
  categoryId?: number;
  itemId?: number;
};

function parsePositiveInt(value: unknown): number | undefined {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(n) || n < 1) return undefined;
  return n;
}

export const Route = createFileRoute("/inventory")({
  validateSearch: (search: Record<string, unknown>): InventorySearch => ({
    categoryId: parsePositiveInt(search.categoryId),
    itemId: parsePositiveInt(search.itemId),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-full bg-rkz-bg dark:bg-slate-900">
      <InventoryPage />
    </div>
  );
}
