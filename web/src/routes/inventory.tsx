import { createFileRoute } from "@tanstack/react-router";
import { InventoryPage } from "../module/inventory-module.tsx";

export const Route = createFileRoute("/inventory")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-full bg-rkz-bg dark:bg-slate-900">
      <InventoryPage />
    </div>
  );
}
