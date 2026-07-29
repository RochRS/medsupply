import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "../components/global/footer.tsx";
import { InventoryPage } from "../module/total-inventory-module.tsx";

import "../css/total-inventory.css";

export const Route = createFileRoute("/total-inventory")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="min-h-screen bg-rkz-bg">
      <InventoryPage />
      </div>
      <Footer />
    </div>
  );
}
