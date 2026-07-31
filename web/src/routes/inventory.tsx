import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "../components/global/footer.tsx";
import { InventoryPage } from "../module/inventory-module.tsx";

import "../css/inventory.css";

export const Route = createFileRoute("/inventory")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="min-h-screen bg-rkz-bg dark:bg-slate-900 ">
      <InventoryPage />
      </div>
      <Footer />
    </div>
  );
}
