import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardPrimaryPanel,
  CriticalInventoryOverview,
  DashboardNotificationsPanel,
  StockStatusOverview,
} from "../module/dashboard-module.tsx";
import { useAppUser } from "../lib/roles";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { role } = useAppUser();

  const subtitle =
    role === "apotheker"
      ? "Inkomende spoed, kritieke voorraad en aanvraagmeldingen"
      : role === "admin"
        ? "Overzicht spoedaanvragen, voorraad en meldingen"
        : "Spoedaanvragen, kritieke voorraad en meldingen";

  return (
    <div className="min-h-full bg-rkz-bg dark:bg-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-rkz-navy dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="min-w-0">
            <DashboardPrimaryPanel />
          </div>
          <div className="min-w-0">
            <CriticalInventoryOverview />
          </div>
          <div className="min-w-0 md:col-span-2 xl:col-span-1">
            <DashboardNotificationsPanel />
          </div>
        </div>

        <StockStatusOverview />
      </div>
    </div>
  );
}
