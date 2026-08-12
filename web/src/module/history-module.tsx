import { useEffect, useState } from "react";
import { StatusBadge } from "../components/global/status-badge";
import { DatePicker } from "../components/global/date-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { apiClient } from "../config/api";
import { LoadingSpinner } from "../components/global/loading-spinner";
import { cn } from "../lib/utils";

type HistoryActivity = {
  id: string;
  type: "aanvraag" | "levering" | "request" | "delivery";
  itemName: string | null;
  amount: number;
  isUrgent: boolean | null;
  isCompleted: boolean | null;
  supplierName: string | null;
  personName: string | null;
  createdAt: string | null;
  status: string;
};

type HistoryResponse = {
  activities: HistoryActivity[];
  summary: {
    total: number;
    regulier: number;
    spoed: number;
  };
};

type UrgencyFilter = "all" | "regulier" | "spoed";
type DatePreset = "all" | "today" | "week" | "month" | "custom";

function toDateInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getPresetRange(
  preset: Exclude<DatePreset, "all" | "custom">,
): { from: string; to: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const to = toDateInputValue(today);

  if (preset === "today") return { from: to, to };
  if (preset === "week") {
    return { from: toDateInputValue(startOfWeek(today)), to };
  }
  return {
    from: toDateInputValue(new Date(today.getFullYear(), today.getMonth(), 1)),
    to,
  };
}

function detectDatePreset(from: string, to: string): DatePreset {
  if (!from && !to) return "all";
  for (const preset of ["today", "week", "month"] as const) {
    const range = getPresetRange(preset);
    if (from === range.from && to === range.to) return preset;
  }
  return "custom";
}

const DATE_PRESETS = [
  { value: "all" as const, label: "Alles" },
  { value: "today" as const, label: "Vandaag" },
  { value: "week" as const, label: "Deze week" },
  { value: "month" as const, label: "Deze maand" },
];

const URGENCY_FILTERS = [
  { value: "all" as const, label: "Alles" },
  { value: "regulier" as const, label: "Regulier" },
  { value: "spoed" as const, label: "Spoed" },
];

function filterButtonClass(active: boolean) {
  return cn(
    "h-10 rounded-xl border px-4 text-sm font-medium transition-colors",
    active
      ? "border-sky-700 bg-sky-700 text-white"
      : "border-slate-200 bg-secondary text-slate-700 dark:border-slate-600 dark:text-slate-200",
  );
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("nl-NL", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function statusForBadge(
  status: string,
): "kritiek" | "laag" | "goed" | "voltooid" | "spoed" | "open" {
  if (status === "spoed" || status === "urgent") return "spoed";
  if (status === "voltooid" || status === "completed") return "voltooid";
  if (status === "open") return "open";
  return "goed";
}

function buildHistoryQuery(
  urgency: UrgencyFilter,
  dateFrom: string,
  dateTo: string,
): string {
  const params = new URLSearchParams();
  if (urgency !== "all") params.set("urgency", urgency);
  if (dateFrom) params.set("from", dateFrom);
  if (dateTo) params.set("to", dateTo);
  const query = params.toString();
  return query ? `?${query}` : "";
}

const TABLE_HEAD_CLASS =
  "h-12 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300";
const TABLE_CELL_CLASS = "px-4 py-3.5 text-sm text-slate-800 dark:text-slate-100";

export function HistoryDisplay() {
  const [data, setData] = useState<HistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyFilter>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const datePreset = detectDatePreset(dateFrom, dateTo);

  const applyDatePreset = (preset: DatePreset) => {
    if (preset === "all") {
      setDateFrom("");
      setDateTo("");
      return;
    }
    if (preset === "custom") return;
    const range = getPresetRange(preset);
    setDateFrom(range.from);
    setDateTo(range.to);
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const query = buildHistoryQuery(urgencyFilter, dateFrom, dateTo);
        const result = (await apiClient(`/history${query}`)) as HistoryResponse;
        if (!cancelled) setData(result);
      } catch {
        if (!cancelled) setError("Geschiedenis kon niet worden geladen.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [urgencyFilter, dateFrom, dateTo]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 sm:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-rkz-navy dark:text-white">
          Geschiedenis
        </h1>
        <p className="text-sm text-slate-500">
          Overzicht van aanvragen en leveringen
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "Totaal", value: data?.summary.total, accent: "text-rkz-navy" },
          {
            label: "Regulier",
            value: data?.summary.regulier,
            accent: "text-sky-700 dark:text-sky-300",
          },
          {
            label: "Spoed",
            value: data?.summary.spoed,
            accent: "text-red-600 dark:text-red-400",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200/70 bg-white px-5 py-4 dark:border-slate-700 dark:bg-slate-800"
          >
            <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
              {card.label}
            </p>
            <p
              className={cn(
                "mt-1 text-3xl font-semibold tabular-nums dark:text-white",
                card.accent,
              )}
            >
              {loading ? "…" : (card.value ?? "—")}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-5 rounded-2xl border border-slate-200/70 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-5">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-rkz-navy dark:text-white">
            Periode
          </p>
          <div className="flex flex-wrap gap-2">
            {DATE_PRESETS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => applyDatePreset(value)}
                className={filterButtonClass(datePreset === value)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-end sm:gap-3">
              <DatePicker
                id="history-from"
                label="Van"
                value={dateFrom}
                onChange={setDateFrom}
                placeholder="Startdatum"
                className="min-w-0 flex-1 sm:max-w-52"
              />

              <span className="hidden shrink-0 pb-2.5 text-sm font-medium text-slate-400 sm:block">
                t/m
              </span>

              <DatePicker
                id="history-to"
                label="Tot"
                value={dateTo}
                onChange={setDateTo}
                placeholder="Einddatum"
                className="min-w-0 flex-1 sm:max-w-52"
              />
            </div>

            {(dateFrom || dateTo) && datePreset === "custom" ? (
              <button
                type="button"
                onClick={() => applyDatePreset("all")}
                className="h-10 shrink-0 rounded-xl border border-slate-200 bg-secondary px-4 text-sm font-medium text-slate-700 dark:border-slate-600 dark:text-slate-200"
              >
                Wissen
              </button>
            ) : null}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 dark:border-slate-700">
          <p className="mb-3 text-sm font-semibold text-rkz-navy dark:text-white">
            Type aanvraag
          </p>
          <div className="flex flex-wrap gap-2">
            {URGENCY_FILTERS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setUrgencyFilter(value)}
                className={filterButtonClass(urgencyFilter === value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner label="Geschiedenis laden..." />}
      {error && (
        <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {!loading && !error && (data?.activities.length ?? 0) === 0 && (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800">
          Geen activiteiten gevonden voor deze filters.
        </p>
      )}

      {!loading && !error && data && data.activities.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white dark:border-slate-700 dark:bg-slate-800">
          <Table className="text-sm">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className={TABLE_HEAD_CLASS}>Datum</TableHead>
                <TableHead className={TABLE_HEAD_CLASS}>Besteld door</TableHead>
                <TableHead className={TABLE_HEAD_CLASS}>Item</TableHead>
                <TableHead className={TABLE_HEAD_CLASS}>Aantal / kost</TableHead>
                <TableHead className={TABLE_HEAD_CLASS}>Details</TableHead>
                <TableHead className={TABLE_HEAD_CLASS}>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className={cn(TABLE_CELL_CLASS, "whitespace-nowrap")}>
                    {formatDate(activity.createdAt)}
                  </TableCell>
                  <TableCell className={TABLE_CELL_CLASS}>
                    {activity.personName ?? "—"}
                  </TableCell>
                  <TableCell
                    className={cn(
                      TABLE_CELL_CLASS,
                      "max-w-56 whitespace-normal font-medium",
                    )}
                  >
                    {activity.itemName ?? "—"}
                  </TableCell>
                  <TableCell className={cn(TABLE_CELL_CLASS, "tabular-nums")}>
                    {activity.amount}
                  </TableCell>
                  <TableCell
                    className={cn(
                      TABLE_CELL_CLASS,
                      "max-w-48 whitespace-normal text-slate-600 dark:text-slate-300",
                    )}
                  >
                    {activity.type === "levering" || activity.type === "delivery"
                      ? (activity.supplierName ?? "—")
                      : activity.isUrgent
                        ? "Spoedaanvraag"
                        : "Reguliere aanvraag"}
                  </TableCell>
                  <TableCell className={TABLE_CELL_CLASS}>
                    <StatusBadge
                      status={statusForBadge(activity.status)}
                      className="h-6 px-2.5 text-xs"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
