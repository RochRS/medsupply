import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "../components/global/footer.tsx";

import {
  KeyStatistics,
  StockStatusDistribution,
  CategoryDistribution,
  CurrentStockLevelsPerItem,
  UsageSection,
  AverageStorageTimePerItem,
} from "../module/statistics-module.tsx";

import "../css/statistics.css";

export const Route = createFileRoute("/statistics")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="min-h-screen bg-rkz-bg dark:bg-slate-900">

        <div className="max-w-6xl mx-auto p-4 pt-6 flex flex-col gap-4">
          <KeyStatistics />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StockStatusDistribution />
            <CategoryDistribution />
          </div>

          <CurrentStockLevelsPerItem />
          <UsageSection />
          <AverageStorageTimePerItem />
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}