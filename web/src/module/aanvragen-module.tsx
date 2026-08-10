import { useEffect, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  ClipboardListIcon,
  FlashIcon,
  Search01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { FormInput } from "../components/global/form-input";
import { LoadingSpinner } from "../components/global/loading-spinner";
import {
  RequestDetailDialog,
  StatusBadge,
  StockBadge,
  formatRequestWhen,
  requestStatusOf,
  type RequestDetail,
} from "../components/requests/request-detail-dialog";
import { Button } from "../components/ui/button";
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

type RequestRow = RequestDetail & {
  status: "open" | "approved" | "completed";
  itemId: number | null;
  stockAmount: number | null;
  stockSufficient: boolean;
  stockShortfall: number;
  requesterEmail: string | null;
  updatedAt: string | null;
};

const STATUS_OPTS = [
  { value: "open", label: "Open" },
  { value: "approved", label: "Klaar voor ophalen" },
  { value: "afgehandeld", label: "Opgehaald" },
  { value: "alle", label: "Alles" },
];

const TYPE_OPTS = [
  { value: "alle", label: "Alle types" },
  { value: "spoed", label: "Spoed" },
  { value: "normaal", label: "Normaal" },
];

export function AanvragenPage() {
  const { isApotheker, loading: roleLoading } = useAppUser();
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("open");
  const [type, setType] = useState("alle");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [selected, setSelected] = useState<RequestRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    if (roleLoading || !isApotheker) return;

    let cancelled = false;
    setLoading(true);
    apiClient("/requests")
      .then((res) => {
        if (cancelled) return;
        const list = (res as { requests: RequestRow[] }).requests ?? [];
        setRows(list);
        setError("");
        if (selected) {
          const updated = list.find((r) => r.requestId === selected.requestId);
          setSelected(updated ?? null);
          if (!updated) setDetailOpen(false);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Aanvragen konden niet worden geladen.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only reload when reloadKey/role changes
  }, [roleLoading, isApotheker, reloadKey]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      const s = requestStatusOf(r);
      if (status === "open" && s !== "open") return false;
      if (status === "approved" && s !== "approved") return false;
      if (status === "afgehandeld" && s !== "completed") return false;
      if (type === "spoed" && !r.isUrgent) return false;
      if (type === "normaal" && r.isUrgent) return false;
      if (!q) return true;
      return (
        (r.itemName ?? "").toLowerCase().includes(q) ||
        (r.requesterName ?? "").toLowerCase().includes(q) ||
        (r.requestDescription ?? "").toLowerCase().includes(q) ||
        (r.requesterEmail ?? "").toLowerCase().includes(q)
      );
    });
  }, [rows, search, status, type]);

  const stats = useMemo(() => {
    const open = rows.filter((r) => requestStatusOf(r) === "open");
    const approved = rows.filter((r) => requestStatusOf(r) === "approved");
    return {
      total: rows.length,
      open: open.length,
      spoed: open.filter((r) => r.isUrgent).length,
      approved: approved.length,
      done: rows.filter((r) => requestStatusOf(r) === "completed").length,
    };
  }, [rows]);

  const openDetails = (req: RequestRow) => {
    setSelected(req);
    setActionError("");
    setDetailOpen(true);
  };

  const runAction = async (id: number, action: "approve" | "complete") => {
    setBusyId(id);
    setActionError("");
    setError("");
    try {
      await apiClient(`/requests/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ action }),
      });
      setReloadKey((k) => k + 1);
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Actie mislukt.";
      setActionError(message);
      setError(message);
    } finally {
      setBusyId(null);
    }
  };

  if (roleLoading) {
    return <LoadingSpinner label="Laden..." />;
  }

  if (!isApotheker) {
    return (
      <div className="mx-auto max-w-lg p-6">
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-6 text-center text-sm text-red-600">
          Alleen apotheker en admin kunnen alle aanvragen inzien.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4 sm:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-rkz-navy dark:text-white">
          Aanvragen
        </h1>
        <p className="text-sm text-slate-500">
          Keur goed om klaar te zetten, en handel af na ophalen
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { label: "Totaal", value: stats.total, accent: "text-rkz-navy" },
          { label: "Open", value: stats.open, accent: "text-amber-700" },
          { label: "Open spoed", value: stats.spoed, accent: "text-rkz-red" },
          {
            label: "Klaar voor ophalen",
            value: stats.approved,
            accent: "text-emerald-700",
          },
          {
            label: "Opgehaald",
            value: stats.done,
            accent: "text-emerald-800",
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
                card.accent,
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
            name="aanvragen-search"
            value={search}
            onChange={setSearch}
            placeholder="Item, aanvrager of beschrijving…"
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
              onValueChange={(v) => setStatus(v ?? "open")}
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
          <p className="text-sm text-slate-500">Geen aanvragen gevonden.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {filtered.map((req) => {
            const s = requestStatusOf(req);
            const short = s === "open" && !req.stockSufficient;
            return (
              <li key={req.requestId}>
                <article
                  role="button"
                  tabIndex={0}
                  onClick={() => openDetails(req)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openDetails(req);
                    }
                  }}
                  className={cn(
                    "group cursor-pointer overflow-hidden rounded-2xl border bg-white transition-colors dark:bg-slate-800",
                    "hover:border-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/30",
                    req.isUrgent && s !== "completed"
                      ? "border-l-[3px] border-l-rkz-red border-slate-200/80 dark:border-slate-700"
                      : "border-slate-200/80 dark:border-slate-700",
                    short ? "border-red-200/80 dark:border-red-900/40" : null,
                  )}
                >
                  <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
                    <div className="min-w-0 flex-1">
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
                        <StockBadge
                          status={s}
                          stockSufficient={req.stockSufficient}
                          stockAmount={req.stockAmount}
                          requestedAmount={req.requestedAmount}
                          stockShortfall={req.stockShortfall}
                        />
                        <span className="text-[11px] text-slate-400">
                          #{req.requestBatchId} · {formatRequestWhen(req.createdAt)}
                        </span>
                      </div>

                      <h2 className="mt-2 text-base font-bold text-rkz-navy dark:text-white">
                        {req.itemName ?? "Onbekend item"}
                        <span className="ml-1.5 font-semibold text-sky-800 dark:text-sky-200">
                          ×{req.requestedAmount}
                        </span>
                      </h2>

                      <p className="mt-0.5 text-sm text-slate-500">
                        {req.requesterName ?? "Onbekende aanvrager"}
                        {req.requestDescription ? (
                          <span className="text-slate-400">
                            {" "}
                            ·{" "}
                            <span className="text-slate-600 dark:text-slate-300">
                              {req.requestDescription.length > 72
                                ? `${req.requestDescription.slice(0, 72)}…`
                                : req.requestDescription}
                            </span>
                          </span>
                        ) : null}
                      </p>

                      {short ? (
                        <p className="mt-2 flex items-start gap-1.5 text-xs font-medium text-red-600">
                          <HugeiconsIcon
                            icon={Alert02Icon}
                            strokeWidth={2}
                            className="mt-0.5 size-3.5 shrink-0"
                          />
                          Niet genoeg op voorraad
                          {req.stockShortfall > 0
                            ? ` — tekort ${req.stockShortfall}`
                            : ""}
                          . Vul eerst voorraad bij.
                        </p>
                      ) : null}
                    </div>

                    <div
                      className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-stretch"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 gap-1.5 rounded-xl border-slate-200"
                        onClick={() => openDetails(req)}
                      >
                        Details
                        <HugeiconsIcon
                          icon={ArrowRight01Icon}
                          strokeWidth={2}
                          className="size-4 opacity-60 transition group-hover:translate-x-0.5"
                        />
                      </Button>
                      {s === "open" ? (
                        <Button
                          type="button"
                          disabled={busyId === req.requestId || short}
                          title={
                            short
                              ? "Niet genoeg voorraad om goed te keuren"
                              : "Goedkeuren en klaarzetten"
                          }
                          onClick={() => void runAction(req.requestId, "approve")}
                          className="h-10 gap-1.5 rounded-xl bg-sky-700 hover:bg-sky-800 disabled:opacity-50"
                        >
                          <HugeiconsIcon
                            icon={Tick02Icon}
                            strokeWidth={2}
                            className="size-4"
                          />
                          {busyId === req.requestId ? "Bezig…" : "Goedkeuren"}
                        </Button>
                      ) : null}
                      {s === "approved" ? (
                        <Button
                          type="button"
                          disabled={busyId === req.requestId}
                          onClick={() =>
                            void runAction(req.requestId, "complete")
                          }
                          className="h-10 gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800"
                        >
                          <HugeiconsIcon
                            icon={CheckmarkCircle02Icon}
                            strokeWidth={2}
                            className="size-4"
                          />
                          {busyId === req.requestId
                            ? "Bezig…"
                            : "Opgehaald"}
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}

      <RequestDetailDialog
        request={selected}
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) setActionError("");
        }}
        busy={selected != null && busyId === selected.requestId}
        actionError={actionError}
        onApprove={(id) => {
          void runAction(id, "approve");
        }}
        onComplete={(id) => {
          void runAction(id, "complete");
        }}
      />
    </div>
  );
}
