import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { apiClient } from "../config/api";
import { LoadingSpinner } from "../components/global/loading-spinner";
import { StatusBadge } from "../components/global/status-badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import { cn } from "../lib/utils";

type StockLevelApi = "critical" | "low" | "ok";

type StatisticsPayload = {
  kpis: {
    avgDailyUsage: number;
    avgStorageDays: number;
    topCategory: string | null;
    totalItems: number;
    totalRequests: number;
  };
  stockStatus: {
    kritiek: number;
    laag: number;
    goed: number;
    total: number;
  };
  categories: Array<{
    categoryId: number;
    categoryName: string;
    itemCount: number;
  }>;
  itemLevels: Array<{
    itemId: number;
    itemName: string;
    remainingAmount: number;
    stockLevel: StockLevelApi;
    categoryName: string | null;
    storageDays: number | null;
  }>;
  usageSeries: Array<{
    key: string;
    label: string;
    amount: number;
  }>;
  usagePeriod: "daily" | "monthly" | "yearly";
  storageByItem: Array<{
    itemId: number;
    itemName: string;
    storageDays: number;
  }>;
};

type UsagePeriod = "daily" | "monthly" | "yearly";

type StatsContextValue = {
  data: StatisticsPayload | null;
  loading: boolean;
  error: string;
  period: UsagePeriod;
  setPeriod: (p: UsagePeriod) => void;
};

const StatsContext = createContext<StatsContextValue | null>(null);

function useStats() {
  const ctx = useContext(StatsContext);
  if (!ctx) throw new Error("useStats must be used within StatisticsProvider");
  return ctx;
}

export function StatisticsProvider({ children }: { children: ReactNode }) {
  const [period, setPeriod] = useState<UsagePeriod>("daily");
  const [data, setData] = useState<StatisticsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiClient(`/statistics?period=${period}`)
      .then((res) => {
        if (!cancelled) {
          setData(res as StatisticsPayload);
          setError("");
        }
      })
      .catch(() => {
        if (!cancelled) setError("Statistieken konden niet worden geladen.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [period]);

  return (
    <StatsContext.Provider
      value={{ data, loading, error, period, setPeriod }}
    >
      {children}
    </StatsContext.Provider>
  );
}

const GEBRUIK_OPTIES = [
  { value: "daily", label: "Dagelijks gebruik" },
  { value: "monthly", label: "Maandelijks gebruik" },
  { value: "yearly", label: "Jaarlijkse vergelijking" },
];

function toUiStock(level: StockLevelApi): "kritiek" | "laag" | "goed" {
  if (level === "critical") return "kritiek";
  if (level === "low") return "laag";
  return "goed";
}

function CardShell({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-bold text-rkz-navy dark:text-white">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
      {message}
    </p>
  );
}

export function KeyStatistics() {
  const { data, loading, error } = useStats();

  const stats = [
    {
      label: "Gemiddeld dagelijks gebruik",
      value: loading ? "…" : data ? `${data.kpis.avgDailyUsage}` : "—",
      suffix: data && !loading ? "stuks/dag" : undefined,
    },
    {
      label: "Gemiddelde opslagtijd",
      value: loading ? "…" : data ? `${data.kpis.avgStorageDays}` : "—",
      suffix: data && !loading ? "dagen" : undefined,
    },
    {
      label: "Meest gebruikte categorie",
      value: loading ? "…" : (data?.kpis.topCategory ?? "—"),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <p className="text-xs text-slate-500">{stat.label}</p>
          {error ? (
            <p className="mt-1 text-sm text-red-600">Fout</p>
          ) : (
            <p className="mt-1 text-2xl font-bold text-rkz-navy dark:text-white">
              {stat.value}
              {stat.suffix ? (
                <span className="ml-1.5 text-sm font-medium text-slate-400">
                  {stat.suffix}
                </span>
              ) : null}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export function StockStatusDistribution() {
  const { data, loading, error } = useStats();
  const s = data?.stockStatus;
  const total = s?.total ?? 0;
  const segments = [
    {
      key: "kritiek",
      label: "Kritiek",
      hint: "≤ 5",
      count: s?.kritiek ?? 0,
      bar: "bg-rkz-red",
      text: "text-rkz-red",
      soft: "bg-red-50 dark:bg-red-950/30",
    },
    {
      key: "laag",
      label: "Laag",
      hint: "6–10",
      count: s?.laag ?? 0,
      bar: "bg-orange-500",
      text: "text-orange-600",
      soft: "bg-orange-50 dark:bg-orange-950/30",
    },
    {
      key: "goed",
      label: "Goed",
      hint: "> 10",
      count: s?.goed ?? 0,
      bar: "bg-emerald-500",
      text: "text-emerald-700",
      soft: "bg-emerald-50 dark:bg-emerald-950/30",
    },
  ];
  const maxCount = Math.max(1, ...segments.map((x) => x.count));

  return (
    <CardShell title="Voorraad status verdeling">
      {loading ? (
        <div className="flex h-56 items-center justify-center">
          <LoadingSpinner label="Laden..." />
        </div>
      ) : error ? (
        <ErrorBox message={error} />
      ) : total === 0 ? (
        <p className="py-10 text-center text-sm text-slate-400">Geen items</p>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
            {segments.map((seg) =>
              seg.count > 0 ? (
                <div
                  key={seg.key}
                  className={seg.bar}
                  style={{ width: `${(seg.count / total) * 100}%` }}
                  title={`${seg.label}: ${seg.count}`}
                />
              ) : null,
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {segments.map((seg) => (
              <div key={seg.key} className={cn("rounded-xl p-3", seg.soft)}>
                <p className={cn("text-xs font-semibold", seg.text)}>
                  {seg.label}
                </p>
                <p className="text-xl font-bold text-sky-950 dark:text-sky-50">
                  {seg.count}
                </p>
                <div className="mt-2 flex h-16 items-end rounded-lg bg-white/60 px-2 pb-1 dark:bg-slate-900/40">
                  <div
                    className={cn("mx-auto w-8 rounded-t-md", seg.bar)}
                    style={{
                      height: `${Math.max(8, (seg.count / maxCount) * 100)}%`,
                    }}
                  />
                </div>
                <p className="mt-1 text-center text-[10px] text-slate-500">
                  {seg.hint} · {Math.round((seg.count / total) * 100)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </CardShell>
  );
}

export function CategoryDistribution() {
  const { data, loading, error } = useStats();
  const cats = data?.categories ?? [];
  const max = Math.max(1, ...cats.map((c) => c.itemCount));
  const total = cats.reduce((sum, c) => sum + c.itemCount, 0);
  const palette = [
    "bg-sky-600",
    "bg-sky-500",
    "bg-cyan-500",
    "bg-teal-500",
    "bg-emerald-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-blue-500",
  ];

  return (
    <CardShell title="Categorie verdeling">
      {loading ? (
        <div className="flex h-56 items-center justify-center">
          <LoadingSpinner label="Laden..." />
        </div>
      ) : error ? (
        <ErrorBox message={error} />
      ) : cats.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-400">
          Geen categorieën
        </p>
      ) : (
        <div className="flex max-h-72 flex-col gap-2.5 overflow-y-auto pr-1">
          {cats.map((cat, i) => (
            <div key={cat.categoryId} className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="truncate font-medium text-slate-700 dark:text-slate-200">
                  {cat.categoryName}
                </span>
                <span className="shrink-0 text-xs text-slate-500">
                  {cat.itemCount}
                  {total > 0
                    ? ` · ${Math.round((cat.itemCount / total) * 100)}%`
                    : ""}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    palette[i % palette.length],
                  )}
                  style={{ width: `${(cat.itemCount / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </CardShell>
  );
}

export function CurrentStockLevelsPerItem() {
  const { data, loading, error } = useStats();
  const items = data?.itemLevels ?? [];
  const max = Math.max(1, ...items.map((i) => i.remainingAmount));

  return (
    <CardShell title="Huidige voorraadniveaus (per item)">
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner label="Laden..." />
        </div>
      ) : error ? (
        <ErrorBox message={error} />
      ) : items.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-400">Geen items</p>
      ) : (
        <div className="flex max-h-80 flex-col gap-2 overflow-y-auto pr-1">
          {items.map((item) => {
            const ui = toUiStock(item.stockLevel);
            const barColor =
              ui === "kritiek"
                ? "bg-rkz-red"
                : ui === "laag"
                  ? "bg-orange-500"
                  : "bg-emerald-500";
            return (
              <div
                key={item.itemId}
                className="grid grid-cols-[minmax(0,1fr)_minmax(5rem,8rem)_auto] items-center gap-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                    {item.itemName}
                  </p>
                  <p className="truncate text-[11px] text-slate-400">
                    {item.categoryName ?? "Geen categorie"}
                  </p>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
                  <div
                    className={cn("h-full rounded-full", barColor)}
                    style={{
                      width: `${Math.max(4, (item.remainingAmount / max) * 100)}%`,
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-8 text-right text-sm font-semibold text-sky-950 dark:text-sky-50">
                    {item.remainingAmount}
                  </span>
                  <StatusBadge status={ui} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </CardShell>
  );
}

export function UsageSection() {
  const { data, loading, error, period, setPeriod } = useStats();
  const series = data?.usageSeries ?? [];
  const max = Math.max(1, ...series.map((p) => p.amount));
  const ticks = [0, Math.round(max / 2), max];
  const chartHeight = 220;
  const barMax = 180;

  return (
    <CardShell
      title="Gebruik"
      action={
        <Select
          items={GEBRUIK_OPTIES}
          value={period}
          onValueChange={(value) =>
            setPeriod((value as UsagePeriod | null) ?? "daily")
          }
        >
          <SelectTrigger className="w-48 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {GEBRUIK_OPTIES.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    >
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner label="Laden..." />
        </div>
      ) : error ? (
        <ErrorBox message={error} />
      ) : series.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-400">
          Nog geen gebruiksdata.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-slate-500">Aangevraagde stuks per periode</p>
          <div className="flex gap-3">
            <div
              className="flex flex-col justify-between pb-8 pt-1 text-right text-[10px] text-slate-400"
              style={{ height: chartHeight }}
            >
              {ticks
                .slice()
                .reverse()
                .map((tick) => (
                  <span key={tick}>{tick}</span>
                ))}
            </div>
            <div className="relative min-w-0 flex-1">
              <div
                className="pointer-events-none absolute inset-x-0 top-1 bottom-8 flex flex-col justify-between"
                aria-hidden
              >
                {ticks.map((tick) => (
                  <div
                    key={tick}
                    className="border-t border-dashed border-slate-200 dark:border-slate-700"
                  />
                ))}
              </div>
              <div
                className="relative flex items-end gap-1 sm:gap-1.5"
                style={{ height: chartHeight }}
              >
                {series.map((point) => {
                  const height = Math.round((point.amount / max) * barMax);
                  return (
                    <div
                      key={point.key}
                      className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1"
                      title={`${point.label}: ${point.amount} stuks`}
                    >
                      {point.amount > 0 ? (
                        <span className="text-[10px] font-semibold text-sky-800 dark:text-sky-200">
                          {point.amount}
                        </span>
                      ) : (
                        <span className="h-3" />
                      )}
                      <div
                        className={cn(
                          "w-full max-w-9 rounded-t-md",
                          point.amount > 0
                            ? "bg-sky-600"
                            : "bg-slate-200 dark:bg-slate-700",
                        )}
                        style={{ height: `${Math.max(height, 4)}px` }}
                      />
                      <span className="w-full truncate text-center text-[10px] leading-tight text-slate-500">
                        {period === "daily"
                          ? point.label.slice(0, 5)
                          : point.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </CardShell>
  );
}

export function AverageStorageTimePerItem() {
  const { data, loading, error } = useStats();
  const rows = data?.storageByItem ?? [];
  const max = Math.max(1, ...rows.map((r) => r.storageDays));

  return (
    <CardShell title="Tijd in opslag (gemiddeld per item)">
      {loading ? (
        <div className="flex h-56 items-center justify-center">
          <LoadingSpinner label="Laden..." />
        </div>
      ) : error ? (
        <ErrorBox message={error} />
      ) : rows.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-400">Geen data</p>
      ) : (
        <div className="flex max-h-72 flex-col gap-2.5 overflow-y-auto pr-1">
          {rows.map((row) => (
            <div key={row.itemId} className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="truncate font-medium text-slate-700 dark:text-slate-200">
                  {row.itemName}
                </span>
                <span className="shrink-0 text-xs font-semibold text-sky-800 dark:text-sky-200">
                  {row.storageDays} d
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
                <div
                  className="h-full rounded-full bg-sky-500"
                  style={{
                    width: `${Math.max(4, (row.storageDays / max) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </CardShell>
  );
}
