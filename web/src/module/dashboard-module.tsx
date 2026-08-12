import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Building03Icon,
  Search01Icon,
  Tick02Icon,
  Alert02Icon,
  FlashIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
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
import {
  RequestBatchDetailDialog,
  formatRequestWhen,
  type RequestDetail,
} from "../components/requests/request-detail-dialog";
import { apiClient } from "../config/api";
import {
  formatBatchProducts,
  formatBatchTitle,
  groupRequestsByBatch,
  type RequestBatch,
} from "../lib/request-batches";
import { cn } from "../lib/utils";
import { useAppUser } from "../lib/roles";

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
          <Label
            htmlFor="noodsituatie"
            className="text-sm font-medium text-sky-950"
          >
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

type IncomingRequest = RequestDetail;

function formatWhen(value: string | null) {
  if (!value) return "";
  return formatRequestWhen(value, false);
}

/** Apotheker/admin: inkomende spoedaanvragen (open) */
export function IncomingUrgentRequests() {
  const [rows, setRows] = useState<IncomingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyBatchId, setBusyBatchId] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [selected, setSelected] = useState<RequestBatch | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const batches = groupRequestsByBatch(rows);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiClient("/requests?urgent=1&open=1")
      .then((res) => {
        if (cancelled) return;
        const list = (res as { requests: IncomingRequest[] }).requests ?? [];
        setRows(list);
        setError("");
        if (selected) {
          const updated = groupRequestsByBatch(list).find(
            (b) => b.requestBatchId === selected.requestBatchId,
          );
          setSelected(updated ?? null);
          if (!updated) setDetailOpen(false);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Spoedmeldingen konden niet worden geladen.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync selected on reload only
  }, [reloadKey]);

  const openDetails = (batch: RequestBatch) => {
    setSelected(batch);
    setActionError("");
    setDetailOpen(true);
  };

  const runBatchAction = async (
    batchId: number,
    action: "approve" | "complete",
  ) => {
    setBusyBatchId(batchId);
    setActionError("");
    try {
      await apiClient(`/requests/batch/${batchId}`, {
        method: "PATCH",
        body: JSON.stringify({ action }),
      });
      setError("");
      setReloadKey((k) => k + 1);
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Kon spoedaanvraag niet bijwerken.";
      setActionError(message);
      setError(message);
    } finally {
      setBusyBatchId(null);
    }
  };

  return (
    <DashboardCard accent="red">
      <CardHeader
        title="Inkomende spoed"
        titleClassName="text-rkz-red"
        subtitle="Open spoedaanvragen — klik voor details"
        badge={
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-rkz-red px-1.5 text-xs font-semibold text-white">
            {batches.length}
          </span>
        }
      />

      <CardBody>
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <LoadingSpinner label="Spoed laden..." />
          </div>
        ) : error && batches.length === 0 ? (
          <ErrorState message={error} />
        ) : batches.length === 0 ? (
          <EmptyState message="Geen open spoedaanvragen." />
        ) : (
          <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-0.5">
            {batches.map((batch) => {
              const short = batch.status === "open" && batch.hasStockIssue;
              return (
                <li key={batch.requestBatchId}>
                  <article
                    role="button"
                    tabIndex={0}
                    onClick={() => openDetails(batch)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openDetails(batch);
                      }
                    }}
                    className={cn(
                      "cursor-pointer rounded-xl border border-red-100 bg-red-50/50 p-3 transition-colors dark:border-red-900/40 dark:bg-red-950/20",
                      "hover:border-red-200 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rkz-red/30",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 rounded bg-rkz-red px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
                            <HugeiconsIcon
                              icon={FlashIcon}
                              strokeWidth={2}
                              className="size-3"
                            />
                            Spoed
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {formatWhen(batch.createdAt)}
                          </span>
                        </div>
                        <p className="mt-1.5 truncate text-sm font-semibold text-rkz-navy dark:text-white">
                          {formatBatchTitle(batch)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {batch.productCount > 1
                            ? formatBatchProducts(batch)
                            : `Aantal: ${batch.totalUnits}`}
                          {batch.requesterName
                            ? ` · ${batch.requesterName}`
                            : null}
                        </p>
                        {batch.requestDescription ? (
                          <p className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-300">
                            {batch.requestDescription}
                          </p>
                        ) : null}
                      </div>
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        strokeWidth={2}
                        className="mt-0.5 size-4 shrink-0 text-slate-400"
                      />
                    </div>
                    <div
                      className="mt-2 flex gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {batch.status === "open" ? (
                        <Button
                          type="button"
                          size="sm"
                          disabled={
                            busyBatchId === batch.requestBatchId || short
                          }
                          title={
                            short
                              ? "Niet genoeg voorraad"
                              : "Hele aanvraag goedkeuren"
                          }
                          onClick={() =>
                            void runBatchAction(batch.requestBatchId, "approve")
                          }
                          className="h-8 flex-1 gap-1.5 rounded-lg bg-sky-700 text-xs hover:bg-sky-800"
                        >
                          <HugeiconsIcon
                            icon={Tick02Icon}
                            strokeWidth={2}
                            className="size-3.5"
                          />
                          {busyBatchId === batch.requestBatchId
                            ? "Bezig..."
                            : `Goedkeuren (${batch.productCount})`}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          disabled={busyBatchId === batch.requestBatchId}
                          onClick={() =>
                            void runBatchAction(
                              batch.requestBatchId,
                              "complete",
                            )
                          }
                          className="h-8 flex-1 gap-1.5 rounded-lg bg-emerald-700 text-xs hover:bg-emerald-800"
                        >
                          <HugeiconsIcon
                            icon={Tick02Icon}
                            strokeWidth={2}
                            className="size-3.5"
                          />
                          {busyBatchId === batch.requestBatchId
                            ? "Bezig..."
                            : "Opgehaald"}
                        </Button>
                      )}
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </CardBody>

      <RequestBatchDetailDialog
        batch={selected}
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) setActionError("");
        }}
        busy={selected != null && busyBatchId === selected.requestBatchId}
        actionError={actionError}
        onApprove={(id) => void runBatchAction(id, "approve")}
        onComplete={(id) => void runBatchAction(id, "complete")}
      />
    </DashboardCard>
  );
}

/** Apotheker: alle recente open aanvragen (spoed + normaal) als meldingen */
export function IncomingRequestNotifications() {
  const [filter, setFilter] = useState("alle");
  const [sort, setSort] = useState("nieuwste");
  const [rows, setRows] = useState<IncomingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyBatchId, setBusyBatchId] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [selected, setSelected] = useState<RequestBatch | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiClient("/requests?open=1")
      .then((res) => {
        if (cancelled) return;
        const list = (res as { requests: IncomingRequest[] }).requests ?? [];
        setRows(list);
        setError("");
        if (selected) {
          const updated = groupRequestsByBatch(list).find(
            (b) => b.requestBatchId === selected.requestBatchId,
          );
          setSelected(updated ?? null);
          if (!updated) setDetailOpen(false);
        }
      })
      .catch(() => {
        if (!cancelled)
          setError("Aanvraagmeldingen konden niet worden geladen.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync selected on reload only
  }, [reloadKey]);

  const openDetails = (batch: RequestBatch) => {
    setSelected(batch);
    setActionError("");
    setDetailOpen(true);
  };

  const runBatchAction = async (
    batchId: number,
    action: "approve" | "complete",
  ) => {
    setBusyBatchId(batchId);
    setActionError("");
    try {
      await apiClient(`/requests/batch/${batchId}`, {
        method: "PATCH",
        body: JSON.stringify({ action }),
      });
      setError("");
      setReloadKey((k) => k + 1);
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Kon aanvraag niet bijwerken.";
      setActionError(message);
      setError(message);
    } finally {
      setBusyBatchId(null);
    }
  };

  const filtered = groupRequestsByBatch(rows)
    .filter((batch) => {
      if (filter === "spoed") return batch.isUrgent;
      if (filter === "normaal") return !batch.isUrgent;
      return true;
    })
    .sort((a, b) => {
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sort === "oudste" ? ta - tb : tb - ta;
    });

  const FILTER_OPTS = [
    { value: "alle", label: "Alle aanvragen" },
    { value: "spoed", label: "Alleen spoed" },
    { value: "normaal", label: "Normaal" },
  ];
  const SORT_OPTS = [
    { value: "nieuwste", label: "Nieuwste eerst" },
    { value: "oudste", label: "Oudste eerst" },
  ];

  return (
    <DashboardCard>
      <CardHeader
        title="Aanvraagmeldingen"
        subtitle="Recente open aanvragen — klik voor details"
        action={
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-sky-700 px-1.5 text-xs font-semibold text-white">
            {filtered.length}
          </span>
        }
      />

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-slate-500">Type</Label>
          <Select
            items={FILTER_OPTS}
            value={filter}
            onValueChange={(v) => setFilter(v ?? "alle")}
          >
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FILTER_OPTS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-slate-500">Sorteren</Label>
          <Select
            items={SORT_OPTS}
            value={sort}
            onValueChange={(v) => setSort(v ?? "nieuwste")}
          >
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && rows.length > 0 ? (
        <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
          {error}
        </p>
      ) : null}

      <CardBody>
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <LoadingSpinner label="Meldingen laden..." />
          </div>
        ) : error && rows.length === 0 ? (
          <ErrorState message={error} />
        ) : filtered.length === 0 ? (
          <EmptyState message="Geen open aanvragen." />
        ) : (
          <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
            {filtered.map((batch) => (
              <li key={batch.requestBatchId}>
                <article
                  role="button"
                  tabIndex={0}
                  onClick={() => openDetails(batch)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openDetails(batch);
                    }
                  }}
                  className={cn(
                    "cursor-pointer rounded-xl border px-3 py-2.5 text-sm transition-colors",
                    "hover:border-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/30",
                    batch.isUrgent
                      ? "border-red-100 bg-red-50/60 dark:border-red-900/40 dark:bg-red-950/20"
                      : "border-slate-100 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-900/40",
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <HugeiconsIcon
                      icon={batch.isUrgent ? FlashIcon : Alert02Icon}
                      strokeWidth={2}
                      className={cn(
                        "size-3.5 shrink-0",
                        batch.isUrgent ? "text-rkz-red" : "text-sky-700",
                      )}
                    />
                    <span
                      className={cn(
                        "text-[11px] font-bold tracking-wide uppercase",
                        batch.isUrgent ? "text-rkz-red" : "text-sky-800",
                      )}
                    >
                      {batch.isUrgent ? "Spoed" : "Aanvraag"}
                    </span>
                    <span className="ml-auto text-[11px] text-slate-400">
                      {formatWhen(batch.createdAt)}
                    </span>
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      strokeWidth={2}
                      className="size-3.5 shrink-0 text-slate-400"
                    />
    </div>
                  <p className="mt-1 font-medium text-rkz-navy dark:text-white">
                    {formatBatchTitle(batch)}{" "}
                    <span className="font-normal text-slate-500">
                      · {batch.totalUnits} stuks
                    </span>
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {batch.requesterName ?? "Onbekende aanvrager"}
                    {batch.productCount > 1
                      ? ` · ${formatBatchProducts(batch)}`
                      : batch.requestDescription
                        ? ` · ${batch.requestDescription}`
                        : ""}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        )}
      </CardBody>

      <RequestBatchDetailDialog
        batch={selected}
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) setActionError("");
        }}
        busy={selected != null && busyBatchId === selected.requestBatchId}
        actionError={actionError}
        onApprove={(id) => void runBatchAction(id, "approve")}
        onComplete={(id) => void runBatchAction(id, "complete")}
      />
    </DashboardCard>
  );
}

/** Kies linker kolom: spoedformulier (verpleging) of inbox (apotheker/admin) */
export function DashboardPrimaryPanel() {
  const { role, loading } = useAppUser();

  if (loading) {
    return (
      <DashboardCard>
        <div className="flex flex-1 items-center justify-center py-12">
          <LoadingSpinner label="Dashboard laden..." />
        </div>
      </DashboardCard>
    );
  }

  // Verpleging stuurt spoed; apotheker/admin ontvangen en verwerken
  if (role === "verpleging") {
    return <EmergencyRequest />;
  }

  return <IncomingUrgentRequests />;
}

/** Rechter kolom: voorraad-alerts of inkomende aanvraagmeldingen */
export function DashboardNotificationsPanel() {
  const { role, loading } = useAppUser();

  if (loading) {
    return (
      <DashboardCard>
        <div className="flex flex-1 items-center justify-center py-12">
          <LoadingSpinner label="..." />
        </div>
      </DashboardCard>
    );
  }

  if (role === "apotheker" || role === "admin") {
    return <IncomingRequestNotifications />;
  }

  return <Notifications />;
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
  categoryId?: number | null;
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
  const navigate = useNavigate();
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

  const openProduct = (item: InventoryItem) => {
    void navigate({
      to: "/inventory",
      search: {
        ...(item.categoryId != null ? { categoryId: item.categoryId } : {}),
        itemId: item.itemId,
      },
    });
  };

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
                <li key={item.itemId}>
                  <button
                    type="button"
                    onClick={() => openProduct(item)}
                    className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:border-sky-200 hover:bg-sky-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300 dark:hover:border-sky-800 dark:hover:bg-sky-950/40"
                  >
                    <span className="min-w-0 truncate">
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
                    </span>
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      strokeWidth={2}
                      className="size-4 shrink-0 text-slate-400"
                    />
                  </button>
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
  const [summary, setSummary] = useState<{
    totalItems: number;
    criticalStock: number;
    lowStock: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    apiClient("/items?page=1&pageSize=1")
      .then((result) => {
        if (cancelled) return;
        const data = result as {
          summary?: {
            totalItems: number;
            criticalStock: number;
            lowStock: number;
          };
        };
        const s = data.summary;
        if (!s) {
          setError("Geen voorraadgegevens beschikbaar.");
          return;
        }
        setSummary({
          totalItems: s.totalItems,
          criticalStock: s.criticalStock,
          lowStock: s.lowStock,
        });
        setError("");
      })
      .catch(() => {
        if (!cancelled) setError("Voorraadstatus kon niet worden geladen.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const kritiek = summary?.criticalStock ?? 0;
  const laag = summary?.lowStock ?? 0;
  const total = summary?.totalItems ?? 0;
  const goed = Math.max(0, total - kritiek - laag);

  const segments = [
    {
      key: "kritiek",
      label: "Kritiek",
      hint: "≤ 5 stuks",
      count: kritiek,
      color: "bg-rkz-red",
      bar: "bg-rkz-red",
      text: "text-rkz-red",
      soft: "bg-red-50 dark:bg-red-950/30",
    },
    {
      key: "laag",
      label: "Laag",
      hint: "6 – 10 stuks",
      count: laag,
      color: "bg-orange-500",
      bar: "bg-orange-500",
      text: "text-orange-600",
      soft: "bg-orange-50 dark:bg-orange-950/30",
    },
    {
      key: "goed",
      label: "Goed",
      hint: "> 10 stuks",
      count: goed,
      color: "bg-emerald-500",
      bar: "bg-emerald-500",
      text: "text-emerald-700",
      soft: "bg-emerald-50 dark:bg-emerald-950/30",
    },
  ] as const;

  const maxCount = Math.max(1, ...segments.map((s) => s.count));

  return (
    <DashboardCard>
      <CardHeader
        title="Voorraad status verdeling"
        subtitle="Overzicht van niveaus"
        action={
          summary ? (
            <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-800 dark:bg-sky-950/50 dark:text-sky-200">
              {total} items
            </span>
          ) : null
        }
      />

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner label="Grafiek laden..." />
        </div>
      ) : error ? (
        <ErrorState message={error} />
      ) : total === 0 ? (
        <EmptyState message="Nog geen producten in de voorraad." />
      ) : (
        <div className="flex flex-col gap-6">
          {/* Stacked distribution bar */}
          <div className="flex h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
            {segments.map((seg) => {
              if (seg.count <= 0) return null;
              const pct = (seg.count / total) * 100;
              return (
                <div
                  key={seg.key}
                  title={`${seg.label}: ${seg.count}`}
                  className={cn(seg.bar, "transition-all")}
                  style={{ width: `${pct}%` }}
                />
              );
            })}
          </div>

          {/* Bars + legend */}
          <div className="grid gap-4 sm:grid-cols-3">
            {segments.map((seg) => {
              const pct = total > 0 ? Math.round((seg.count / total) * 100) : 0;
              const barHeight = `${Math.max(8, (seg.count / maxCount) * 100)}%`;
              return (
                <div
                  key={seg.key}
                  className={cn(
                    "flex flex-col gap-3 rounded-2xl border border-slate-100 p-4 dark:border-slate-700",
                    seg.soft,
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={cn("text-sm font-semibold", seg.text)}>
                        {seg.label}
                      </p>
                      <p className="text-[11px] text-slate-500">{seg.hint}</p>
                    </div>
                    <span className="text-lg font-bold text-sky-950 dark:text-sky-50">
                      {seg.count}
                    </span>
                  </div>

                  <div className="flex h-28 items-end rounded-xl bg-white/70 px-3 pb-2 pt-3 dark:bg-slate-900/40">
                    <div
                      className={cn(
                        "mx-auto w-12 rounded-t-lg transition-all",
                        seg.bar,
                      )}
                      style={{ height: barHeight }}
                      title={`${pct}%`}
                    />
      </div>

                  <p className="text-center text-xs font-medium text-slate-500">
                    {pct}% van totaal
                  </p>
                </div>
              );
            })}
          </div>
    </div>
      )}
    </DashboardCard>
  );
}
