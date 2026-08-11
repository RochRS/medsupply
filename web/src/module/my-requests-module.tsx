import { useEffect, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ClipboardListIcon,
  FlashIcon,
  PackageIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { FormInput } from "../components/global/form-input";
import { LoadingSpinner } from "../components/global/loading-spinner";
import {
  StatusBadge,
  formatRequestWhen,
  requestStatusOf,
  type RequestDetail,
  type RequestStatus,
} from "../components/requests/request-detail-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { apiClient } from "../config/api";
import { useAppUser } from "../lib/roles";
import { cn } from "../lib/utils";

const STATUS_OPTS = [
  { value: "alle", label: "Alle statussen" },
  { value: "open", label: "In afwachting" },
  { value: "approved", label: "Klaar voor ophalen" },
  { value: "completed", label: "Opgehaald" },
];

const TYPE_OPTS = [
  { value: "alle", label: "Alle types" },
  { value: "spoed", label: "Spoed" },
  { value: "normaal", label: "Normaal" },
];

function nurseHint(status: RequestStatus): string {
  switch (status) {
    case "open":
      return "Wacht op de apotheek — nog niet goedgekeurd";
    case "approved":
      return "Goedgekeurd door de apotheek — mag worden opgehaald";
    case "completed":
      return "Opgehaald en afgerond";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

export function MyRequestsPage() {
  const { role, loading: roleLoading, isVerpleging } = useAppUser();
  const [rows, setRows] = useState<RequestDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("alle");
  const [type, setType] = useState("alle");

  useEffect(() => {
    if (roleLoading) return;

    let cancelled = false;
    setLoading(true);
    // mine=1: server filtert op session user; verpleging krijgt dat sowieso
    apiClient("/requests?mine=1")
      .then((res) => {
        if (cancelled) return;
        setRows((res as { requests: RequestDetail[] }).requests ?? []);
        setError("");
      })
      .catch(() => {
        if (!cancelled) setError("Je aanvragen konden niet worden geladen.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [roleLoading]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      const s = requestStatusOf(r);
      if (status !== "alle" && s !== status) return false;
      if (type === "spoed" && !r.isUrgent) return false;
      if (type === "normaal" && r.isUrgent) return false;
      if (!q) return true;
      return (
        (r.itemName ?? "").toLowerCase().includes(q) ||
        (r.requestDescription ?? "").toLowerCase().includes(q) ||
        String(r.requestBatchId).includes(q)
      );
    });
  }, [rows, search, status, type]);

  const stats = useMemo(() => {
    return {
      total: rows.length,
      open: rows.filter((r) => requestStatusOf(r) === "open").length,
      approved: rows.filter((r) => requestStatusOf(r) === "approved").length,
      done: rows.filter((r) => requestStatusOf(r) === "completed").length,
    };
  }, [rows]);

  if (roleLoading) {
    return <LoadingSpinner label="Laden..." />;
  }

  // Only verpleging (and admin testing as nurse flows with mine=1)
  if (role === "apotheker") {
    return (
      <div className="mx-auto max-w-lg p-6">
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-600">
          Als apotheker zie je alle inkomende aanvragen onder{" "}
          <span className="font-semibold">Aanvragen</span> in het menu.
        </div>
      </div>
    );
  }

  if (!isVerpleging && role !== "admin") {
    return (
      <div className="mx-auto max-w-lg p-6">
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-6 text-center text-sm text-red-600">
          Geen toegang tot eigen aanvragen.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-rkz-navy dark:text-white">
          Mijn aanvragen
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Alleen jouw aanvragen — status wordt bijgewerkt als de apotheek
          goedkeurt of ophalen bevestigt
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Totaal", value: stats.total, className: "text-rkz-navy" },
          {
            label: "In afwachting",
            value: stats.open,
            className: "text-amber-700",
          },
          {
            label: "Klaar voor ophalen",
            value: stats.approved,
            className: "text-emerald-700",
          },
          {
            label: "Opgehaald",
            value: stats.done,
            className: "text-emerald-800",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200/70 bg-white px-4 py-3.5 dark:border-slate-700 dark:bg-slate-800"
          >
            <p className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
              {card.label}
            </p>
            <p
              className={cn(
                "mt-1 text-2xl font-semibold tabular-nums dark:text-white",
                card.className,
              )}
            >
              {loading ? "…" : card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <FormInput
            label="Zoeken"
            name="mijn-aanvragen-search"
            value={search}
            onChange={setSearch}
            placeholder="Product of batch…"
            className="rounded-xl"
            icon={
              <HugeiconsIcon
                icon={Search01Icon}
                strokeWidth={2}
                className="size-4"
              />
            }
          />
        </div>
        <div className="grid w-full grid-cols-2 gap-3 sm:w-auto sm:min-w-[18rem]">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-sky-950 dark:text-slate-200">
              Status
            </label>
            <Select
              items={STATUS_OPTS}
              value={status}
              onValueChange={(v) => setStatus(v ?? "alle")}
            >
              <SelectTrigger className="w-full rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-sky-950 dark:text-slate-200">
              Type
            </label>
            <Select
              items={TYPE_OPTS}
              value={type}
              onValueChange={(v) => setType(v ?? "alle")}
            >
              <SelectTrigger className="w-full rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TYPE_OPTS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      {loading ? (
        <LoadingSpinner label="Aanvragen laden..." />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-14 text-center dark:border-slate-700 dark:bg-slate-800">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 dark:bg-slate-900">
            <HugeiconsIcon
              icon={ClipboardListIcon}
              strokeWidth={2}
              className="size-6"
            />
          </div>
          <p className="text-sm text-slate-500">Nog geen aanvragen gevonden.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {filtered.map((req) => {
            const s = requestStatusOf(req);
            return (
              <li key={req.requestId}>
                <article
                  className={cn(
                    "rounded-2xl border bg-white p-4 dark:bg-slate-800",
                    req.isUrgent && s !== "completed"
                      ? "border-l-[3px] border-l-rkz-red border-slate-200/80"
                      : "border-slate-200/80 dark:border-slate-700",
                    s === "approved" &&
                      "border-emerald-200/90 dark:border-emerald-900/50",
                  )}
                >
                  <div className="flex flex-wrap items-center gap-1.5">
                    {req.isUrgent ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-rkz-red px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
                        <HugeiconsIcon
                          icon={FlashIcon}
                          strokeWidth={2}
                          className="size-3"
                        />
                        Spoed
                      </span>
                    ) : (
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-slate-600 uppercase dark:bg-slate-900 dark:text-slate-300">
                        Normaal
                      </span>
                    )}
                    <StatusBadge status={s} />
                    <span className="text-[11px] text-slate-400">
                      #{req.requestBatchId} ·{" "}
                      {formatRequestWhen(req.createdAt)}
                    </span>
                  </div>

                  <div className="mt-2 flex items-start gap-3">
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-800 dark:bg-slate-900">
                      <HugeiconsIcon
                        icon={PackageIcon}
                        strokeWidth={2}
                        className="size-4"
                      />
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-base font-bold text-rkz-navy dark:text-white">
                        {req.itemName ?? "Onbekend item"}
                        <span className="ml-1.5 font-semibold text-sky-800 dark:text-sky-200">
                          ×{req.requestedAmount}
                        </span>
                      </h2>
                      <p
                        className={cn(
                          "mt-1 text-sm font-medium",
                          s === "approved" && "text-emerald-700",
                          s === "open" && "text-amber-700",
                          s === "completed" && "text-slate-500",
                        )}
                      >
                        {nurseHint(s)}
                      </p>
                      {req.requestDescription ? (
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                          {req.requestDescription}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
