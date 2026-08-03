import { createFileRoute } from "@tanstack/react-router";
import {
  KeyStatistics,
  StockStatusDistribution,
  CategoryDistribution,
  CurrentStockLevelsPerItem,
  UsageSection,
  AverageStorageTimePerItem,
} from "../module/statistics-module.tsx";

export const Route = createFileRoute("/statistics")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-full bg-rkz-bg dark:bg-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 p-4 pt-6">
        <KeyStatistics />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <StockStatusDistribution />
          <CategoryDistribution />
        </div>

        <CurrentStockLevelsPerItem />
        <UsageSection />
        <AverageStorageTimePerItem />
      </div>
    </div>
  );
}
