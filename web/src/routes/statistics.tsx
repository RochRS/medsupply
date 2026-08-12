import { createFileRoute } from "@tanstack/react-router";
import {
  StatisticsProvider,
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
      <div className="mx-auto flex max-w-6xl flex-col gap-4 p-4 pt-6 pb-10">
        <header className="mb-1">
          <h1 className="text-2xl font-bold tracking-tight text-sky-950 dark:text-sky-50">
            Statistieken
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Overzicht van voorraad, gebruik en opslagtijd
          </p>
        </header>

        <StatisticsProvider>
          <KeyStatistics />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <StockStatusDistribution />
            <CategoryDistribution />
          </div>

          <CurrentStockLevelsPerItem />
          <UsageSection />
          <AverageStorageTimePerItem />
        </StatisticsProvider>
      </div>
    </div>
  );
}
