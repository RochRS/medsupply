import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  PackageIcon,
  ShoppingBagAddIcon,
} from "@hugeicons/core-free-icons";
import {
  DashboardPrimaryPanel,
  CriticalInventoryOverview,
  DashboardNotificationsPanel,
  StockStatusOverview,
} from "../module/dashboard-module.tsx";
import { useAppUser } from "../lib/roles";
import { useCart } from "../lib/cart";
import { LoadingSpinner } from "../components/global/loading-spinner";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function VerplegingHome() {
  const navigate = useNavigate();
  const { productCount, totalCount } = useCart();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-rkz-navy dark:text-white">
          Welkom
        </h1>
        <p className="text-sm text-slate-500">
          Kies supplies uit een categorie, vul je mand en stuur de aanvraag
        </p>
      </div>

      <ol className="flex flex-col gap-3">
        {[
          {
            step: "1",
            title: "Kies een categorie",
            text: "Open Supplies en selecteer de productgroep die je nodig hebt.",
          },
          {
            step: "2",
            title: "Producten in de mand",
            text: "Voeg de benodigde items toe. Het aantal in de sidebar toont je mand.",
          },
          {
            step: "3",
            title: "Aanvraag versturen",
            text: "Ga naar Mijn mand, vul afdeling en urgentie in, en verstuur.",
          },
        ].map((row) => (
          <li
            key={row.step}
            className="flex gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sm font-bold text-sky-900">
              {row.step}
            </span>
            <div>
              <p className="font-semibold text-rkz-navy dark:text-white">
                {row.title}
              </p>
              <p className="mt-0.5 text-sm text-slate-500">{row.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => void navigate({ to: "/inventory" })}
          className="flex flex-col gap-2 rounded-2xl border border-sky-200 bg-sky-50/80 p-5 text-left transition hover:border-sky-300 hover:bg-sky-50"
        >
          <HugeiconsIcon
            icon={PackageIcon}
            strokeWidth={2}
            className="size-6 text-sky-800"
          />
          <span className="text-base font-bold text-sky-950">
            Supplies kiezen
          </span>
          <span className="text-sm text-sky-800/80">
            Categorieën en producten
          </span>
          <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-sky-900">
            Start
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              strokeWidth={2}
              className="size-4"
            />
          </span>
        </button>

        <button
          type="button"
          onClick={() => void navigate({ to: "/request" })}
          className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-sky-200 hover:bg-sky-50/40 dark:border-slate-700 dark:bg-slate-800"
        >
          <HugeiconsIcon
            icon={ShoppingBagAddIcon}
            strokeWidth={2}
            className="size-6 text-rkz-navy dark:text-white"
          />
          <span className="text-base font-bold text-rkz-navy dark:text-white">
            Mijn mand
          </span>
          <span className="text-sm text-slate-500">
            {productCount > 0
              ? `${productCount} product${productCount === 1 ? "" : "en"} · ${totalCount} stuks`
              : "Nog leeg — voeg eerst supplies toe"}
          </span>
          <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-sky-800">
            {productCount > 0 ? "Aanvraag afronden" : "Bekijk mand"}
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              strokeWidth={2}
              className="size-4"
            />
          </span>
        </button>

        <button
          type="button"
          onClick={() => void navigate({ to: "/mijn-aanvragen" })}
          className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-sky-200 hover:bg-sky-50/40 sm:col-span-2 dark:border-slate-700 dark:bg-slate-800"
        >
          <span className="text-base font-bold text-rkz-navy dark:text-white">
            Mijn aanvragen
          </span>
          <span className="text-sm text-slate-500">
            Bekijk of de apotheek al heeft goedgekeurd en of je kunt ophalen
          </span>
          <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-sky-800">
            Status bekijken
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              strokeWidth={2}
              className="size-4"
            />
          </span>
        </button>
      </div>
    </div>
  );
}

function ApothekerDashboard() {
  const { role } = useAppUser();

  const subtitle =
    role === "apotheker"
      ? "Inkomende spoed, kritieke voorraad en aanvraagmeldingen"
      : "Overzicht spoedaanvragen, voorraad en meldingen";

  return (
    <>
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
    </>
  );
}

function RouteComponent() {
  const { role, loading } = useAppUser();

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner label="Dashboard laden..." />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-rkz-bg dark:bg-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8">
        {role === "verpleging" ? (
          <VerplegingHome />
        ) : (
          <ApothekerDashboard />
        )}
      </div>
    </div>
  );
}
