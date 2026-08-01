import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "../components/global/footer.tsx";

import {
  EmergencyRequest,
  CriticalInventoryOverview,
  Notifications,
  StockStatusOverview,
} from "../module/dashboard-module.tsx";

import "../css/dashboard.css";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="min-h-screen bg-rkz-bg dark:bg-slate-900">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 pt-6 max-w-7xl mx-auto">
          <EmergencyRequest />
          <CriticalInventoryOverview />
          <Notifications />
        </div>

        <div className="px-4 pb-8 max-w-7x1 mx-auto">
         <StockStatusOverview />

        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}