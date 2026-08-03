import { useEffect, useState, type ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Building03Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { FormInput } from "../components/global/form-input";
import { LoadingSpinner } from "../components/global/loading-spinner";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { apiClient } from "../config/api";
import { cn } from "../lib/utils";

function DashboardCard({
  children,
  className,
  accent,
}: {
  children: ReactNode;
  className?: string;
  accent?: "red";
}) {
  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800",
        accent === "red" && "border-t-4 border-t-rkz-red",
        className,
      )}
    >
      {children}
    </div>
  );
}

function CardHeader({
  title,
  titleClassName,
  subtitle,
  badge,
  action,
}: {
  title: string;
  titleClassName?: string;
  subtitle?: string;
  badge?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2
            className={cn(
              "text-base font-bold text-rkz-navy dark:text-white",
              titleClassName,
            )}
          >
            {title}
          </h2>
          {badge}
        </div>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

function CardBody({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
      {children}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-6 text-center dark:border-slate-700 dark:bg-slate-900/40">
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-1 items-center justify-center rounded-xl border border-red-100 bg-red-50/80 px-4 py-6 text-center">
      <p className="text-sm text-red-600">{message}</p>
    </div>
  );
}

export function EmergencyRequest() {
  const [search, setSearch] = useState("");
  const [afdeling, setAfdeling] = useState("");
  const [noodsituatie, setNoodsituatie] = useState("");

  const handleSubmit = () => {
    console.log({ search, afdeling, noodsituatie });
  };

  return (
    <DashboardCard accent="red">
      <CardHeader
        title="Spoedaanvraag"
        titleClassName="text-rkz-red"
        subtitle="Hoogste prioriteit"
        badge={
          <span className="rounded bg-rkz-red px-2 py-0.5 text-[10px] font-bold text-white">
            SPOED
          </span>
        }
      />

      <CardBody>
        <FormInput
          label="Zoek supplies"
          name="search"
          value={search}
          onChange={setSearch}
          placeholder="Zoek op naam of categorie"
          className="rounded-xl bg-white"
          icon={
            <HugeiconsIcon
              icon={Search01Icon}
              strokeWidth={2}
              className="size-4"
            />
          }
        />

        <FormInput
          label="Afdeling"
          name="afdeling"
          value={afdeling}
          onChange={setAfdeling}
          placeholder="Bijv. SEH, Cardiologie"
          className="rounded-xl bg-white"
          icon={
            <HugeiconsIcon
              icon={Building03Icon}
              strokeWidth={2}
              className="size-4"
            />
          }
        />

        <div className="flex min-h-0 flex-1 flex-col gap-1.5">
          <Label htmlFor="noodsituatie" className="text-sm font-medium text-sky-950">
            Noodsituatie
          </Label>
          <Textarea
            id="noodsituatie"
            value={noodsituatie}
            onChange={(e) => setNoodsituatie(e.target.value)}
            placeholder="Beschrijf kort de noodsituatie"
            className="min-h-24 flex-1 resize-none rounded-xl bg-white"
          />
        </div>
      </CardBody>

      <Button
        onClick={handleSubmit}
        className="h-10 w-full shrink-0 rounded-xl bg-rkz-red hover:bg-rkz-red/90"
      >
        Spoedaanvraag versturen
      </Button>
    </DashboardCard>
  );
}

const VOORRAAD_NIVEAUS = [
  { value: "alle-niveaus", label: "Alle niveaus" },
  { value: "kritiek", label: "Kritiek" },
  { value: "laag", label: "Laag" },
  { value: "goed", label: "Goed" },
];

const CATEGORIEEN = [
  { value: "alle-categorieen", label: "Alle categorieën" },
  { value: "medicatie", label: "Medicatie" },
  { value: "gassen", label: "Gassen" },
];

type StockLevel = "kritiek" | "laag" | "goed" | "critical" | "low" | "ok";

type InventoryItem = {
  itemId: number;
  itemName: string;
  stockLevel: StockLevel;
};

type InventoryResponse = {
  items: InventoryItem[];
};

function toUiLevel(level: StockLevel): "kritiek" | "laag" | "goed" {
  if (level === "critical" || level === "kritiek") return "kritiek";
  if (level === "low" || level === "laag") return "laag";
  return "goed";
}

function isAttention(level: StockLevel) {
  const ui = toUiLevel(level);
  return ui === "kritiek" || ui === "laag";
}

export function CriticalInventoryOverview() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [level, setLevel] = useState("alle-niveaus");
  const [category, setCategory] = useState("alle-categorieen");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    apiClient("/items")
      .then((result) => {
        if (cancelled) return;
        const data = result as InventoryResponse;
        setItems((data.items ?? []).filter((i) => isAttention(i.stockLevel)));
        setError("");
      })
      .catch(() => {
        if (!cancelled) setError("Voorraadoverzicht kon niet worden geladen.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = items.filter((item) => {
    if (level === "alle-niveaus") return true;
    return toUiLevel(item.stockLevel) === level;
  });

  return (
    <DashboardCard>
      <CardHeader
        title="Kritiek Voorraadoverzicht"
        subtitle="Lage en kritieke stock"
      />

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-slate-500">Niveau</Label>
          <Select
            items={VOORRAAD_NIVEAUS}
            value={level}
            onValueChange={(v) => setLevel(v ?? "alle-niveaus")}
          >
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VOORRAAD_NIVEAUS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-slate-500">Categorie</Label>
          <Select
            items={CATEGORIEEN}
            value={category}
            onValueChange={(v) => setCategory(v ?? "alle-categorieen")}
          >
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIEEN.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <CardBody>
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <LoadingSpinner label="Overzicht laden..." />
          </div>
        ) : error ? (
          <ErrorState message={error} />
        ) : filtered.length === 0 ? (
          <EmptyState message="Geen kritieke of lage voorraad." />
        ) : (
          <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
            {filtered.map((item) => {
              const ui = toUiLevel(item.stockLevel);
              return (
                <li
                  key={item.itemId}
                  className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300"
                >
                  <span
                    className={
                      ui === "kritiek"
                        ? "font-medium text-rkz-red"
                        : "font-medium text-orange-500"
                    }
                  >
                    {ui === "kritiek" ? "Kritiek" : "Laag"}:
                  </span>{" "}
                  {item.itemName}
                </li>
              );
            })}
          </ul>
        )}
      </CardBody>
    </DashboardCard>
  );
}

const MELDING_TYPES = [
  { value: "alle-meldingen", label: "Alle meldingen" },
  { value: "waarschuwing", label: "Waarschuwing" },
  { value: "update", label: "Voorraad update" },
];

const SORTEER_OPTIES = [
  { value: "nieuwste", label: "Nieuwste eerst" },
  { value: "oudste", label: "Oudste eerst" },
];

export function Notifications() {
  const [alerts, setAlerts] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    apiClient("/items")
      .then((result) => {
        if (cancelled) return;
        const data = result as InventoryResponse;
        setAlerts((data.items ?? []).filter((i) => isAttention(i.stockLevel)));
        setError("");
      })
      .catch(() => {
        if (!cancelled) setError("Meldingen konden niet worden geladen.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <DashboardCard>
      <CardHeader
        title="Meldingen"
        subtitle="Actuele waarschuwingen"
        action={
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-rkz-red px-1.5 text-xs font-semibold text-white">
            {alerts.length}
          </span>
        }
      />

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-slate-500">Type melding</Label>
          <Select items={MELDING_TYPES} defaultValue="alle-meldingen">
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MELDING_TYPES.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-slate-500">Sorteren</Label>
          <Select items={SORTEER_OPTIES} defaultValue="nieuwste">
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORTEER_OPTIES.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <CardBody>
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <LoadingSpinner label="Meldingen laden..." />
          </div>
        ) : error ? (
          <ErrorState message={error} />
        ) : alerts.length === 0 ? (
          <EmptyState message="Geen nieuwe meldingen" />
        ) : (
          <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
            {alerts.map((item) => {
              const ui = toUiLevel(item.stockLevel);
              return (
                <li
                  key={item.itemId}
                  className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300"
                >
                  <span
                    className={
                      ui === "kritiek"
                        ? "font-medium text-rkz-red"
                        : "font-medium text-orange-500"
                    }
                  >
                    {ui === "kritiek" ? "Kritiek" : "Laag"}:
                  </span>{" "}
                  {item.itemName}
                </li>
              );
            })}
          </ul>
        )}
      </CardBody>
    </DashboardCard>
  );
}

export function StockStatusOverview() {
  return (
    <DashboardCard>
      <CardHeader
        title="Voorraad status verdeling"
        subtitle="Overzicht van niveaus"
      />
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 dark:border-slate-700">
        <p className="text-sm text-slate-400">Grafiek komt hier</p>
      </div>
    </DashboardCard>
  );
}
