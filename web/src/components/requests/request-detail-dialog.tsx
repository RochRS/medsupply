import type { ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  CheckmarkCircle02Icon,
  DeliveryBox01Icon,
  FlashIcon,
  PackageIcon,
  Tick02Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { cn } from "../../lib/utils";

export type RequestStatus = "open" | "approved" | "completed";

export type RequestDetail = {
  requestId: number;
  requestBatchId: number;
  requestedAmount: number;
  isUrgent: boolean;
  status?: RequestStatus | string | null;
  isCompleted: boolean;
  itemId?: number | null;
  itemName: string | null;
  stockAmount?: number | null;
  stockSufficient?: boolean;
  stockShortfall?: number;
  requestDescription: string | null;
  requesterName: string | null;
  requesterEmail?: string | null;
  createdAt: string | null;
  updatedAt?: string | null;
};

export function formatRequestWhen(
  value: string | null | undefined,
  withYear = true,
) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("nl-NL", {
    day: "numeric",
    month: "short",
    ...(withYear ? { year: "numeric" as const } : {}),
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function requestStatusOf(req: RequestDetail): RequestStatus {
  if (
    req.status === "approved" ||
    req.status === "completed" ||
    req.status === "open"
  ) {
    return req.status;
  }
  return req.isCompleted ? "completed" : "open";
}

export function StatusBadge({ status }: { status: RequestStatus }) {
  if (status === "completed") {
    return (
      <span
        title="Aanvraag is opgehaald en volledig afgerond"
        className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 uppercase dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
      >
        <HugeiconsIcon
          icon={CheckmarkCircle02Icon}
          strokeWidth={2}
          className="size-3"
        />
        Opgehaald
      </span>
    );
  }
  if (status === "approved") {
    return (
      <span
        title="Goedgekeurd en klaargezet — wacht op ophalen door aanvrager"
        className="inline-flex items-center gap-1 rounded-md border border-emerald-300 bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-900 uppercase dark:border-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-100"
      >
        <HugeiconsIcon
          icon={DeliveryBox01Icon}
          strokeWidth={2}
          className="size-3"
        />
        Klaar voor ophalen
      </span>
    );
  }
  return (
    <span
      title="Nog niet goedgekeurd"
      className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 uppercase dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
    >
      Open
    </span>
  );
}

export function StockBadge({
  status,
  stockSufficient,
  stockAmount,
  requestedAmount,
  stockShortfall,
}: {
  status: RequestStatus;
  stockSufficient: boolean;
  stockAmount: number | null | undefined;
  requestedAmount: number;
  stockShortfall: number;
}) {
  if (status === "completed") {
    return null;
  }

  if (status === "approved") {
    return (
      <span
        title={`${requestedAmount} stuks afgeboekt van voorraad en klaargezet voor de aanvrager`}
        className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 uppercase dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300"
      >
        <HugeiconsIcon icon={PackageIcon} strokeWidth={2} className="size-3" />
        Gereserveerd ×{requestedAmount}
      </span>
    );
  }

  if (stockSufficient) {
    return (
      <span
        title="Genoeg voorraad om goed te keuren"
        className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 uppercase dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
      >
        <HugeiconsIcon
          icon={CheckmarkCircle02Icon}
          strokeWidth={2}
          className="size-3"
        />
        Op voorraad
        {stockAmount != null ? ` (${stockAmount})` : null}
      </span>
    );
  }

  return (
    <span
      title="Niet genoeg voorraad — goedkeuren geblokkeerd"
      className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700 uppercase dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
    >
      <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-3" />
      Tekort
      {stockShortfall > 0
        ? ` (−${stockShortfall})`
        : stockAmount != null
          ? ` (${stockAmount}/${requestedAmount})`
          : null}
    </span>
  );
}

function DetailRow({
  label,
  value,
  className,
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
        {label}
      </span>
      <span className="text-sm font-medium text-rkz-navy dark:text-white">
        {value}
      </span>
    </div>
  );
}

export function RequestDetailDialog({
  request,
  open,
  onOpenChange,
  onApprove,
  onComplete,
  busy,
  actionError,
}: {
  request: RequestDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (id: number) => void;
  onComplete: (id: number) => void;
  busy: boolean;
  actionError: string;
}) {
  if (!request) return null;

  const status = requestStatusOf(request);
  const stockSufficient = request.stockSufficient ?? true;
  const stockShortfall = request.stockShortfall ?? 0;
  const short =
    status === "open" && (stockShortfall > 0 || !stockSufficient);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-lg">
        <DialogHeader
          className={cn(
            "border-b px-5 py-4",
            request.isUrgent && status !== "completed"
              ? "border-red-100 bg-red-50/50 dark:border-red-900/40 dark:bg-red-950/20"
              : "border-slate-100 dark:border-slate-700",
          )}
        >
          <div className="flex flex-wrap items-center gap-2 pr-8">
            {request.isUrgent ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-rkz-red px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
                <HugeiconsIcon
                  icon={FlashIcon}
                  strokeWidth={2}
                  className="size-3"
                />
                Spoed
              </span>
            ) : (
              <span className="rounded-md bg-sky-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-sky-900 uppercase dark:bg-sky-950 dark:text-sky-100">
                Normaal
              </span>
            )}
            <StatusBadge status={status} />
            <StockBadge
              status={status}
              stockSufficient={stockSufficient}
              stockAmount={request.stockAmount}
              requestedAmount={request.requestedAmount}
              stockShortfall={stockShortfall}
            />
          </div>
          <DialogTitle className="mt-2 text-lg font-bold text-rkz-navy dark:text-white">
            Aanvraagdetails
          </DialogTitle>
          <p className="text-xs text-slate-500">
            #{request.requestId} · batch {request.requestBatchId}
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-5 py-4">
          <section className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4 dark:border-sky-900 dark:bg-sky-950/30">
            <div className="mb-2 flex items-center gap-2 text-sky-900 dark:text-sky-100">
              <HugeiconsIcon
                icon={PackageIcon}
                strokeWidth={2}
                className="size-4"
              />
              <h3 className="text-xs font-bold tracking-wide uppercase">
                Wat is nodig
              </h3>
            </div>
            <p className="text-lg font-bold text-rkz-navy dark:text-white">
              {request.itemName ?? "Onbekend product"}
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Gevraagd aantal:{" "}
              <span className="text-base font-bold text-sky-900 dark:text-sky-100">
                {request.requestedAmount}
              </span>
            </p>
            {status === "open" ? (
              <p className="mt-1 text-sm text-slate-500">
                Huidige voorraad:{" "}
                {request.stockAmount != null ? (
                  <span
                    className={cn(
                      "font-semibold",
                      short ? "text-rkz-red" : "text-emerald-700",
                    )}
                  >
                    {request.stockAmount}
                  </span>
                ) : (
                  "—"
                )}
              </p>
            ) : status === "approved" ? (
              <p className="mt-1 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                {request.requestedAmount} stuks gereserveerd uit voorraad —
                wacht op ophalen
              </p>
            ) : (
              <p className="mt-1 text-sm font-medium text-emerald-800 dark:text-emerald-200">
                {request.requestedAmount} stuks opgehaald en afgerond
              </p>
            )}
          </section>

          {status === "open" && short ? (
            <Alert variant="destructive">
              <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} />
              <AlertTitle>Niet genoeg op voorraad</AlertTitle>
              <AlertDescription>
                Er {request.stockAmount === 1 ? "is" : "zijn"}{" "}
                {request.stockAmount ?? 0} beschikbaar, maar er{" "}
                {request.requestedAmount === 1 ? "wordt" : "worden"}{" "}
                {request.requestedAmount} gevraagd
                {stockShortfall > 0 ? ` (tekort: ${stockShortfall})` : ""}. Vul
                de voorraad aan of bestel bij vóór je goedkeurt.
              </AlertDescription>
            </Alert>
          ) : null}

          {status === "open" && !short ? (
            <Alert>
              <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} />
              <AlertTitle>Op voorraad</AlertTitle>
              <AlertDescription>
                Er is genoeg voorraad. Bij goedkeuren boeken we de voorraad af
                en staat het klaar voor ophalen door de aanvrager.
              </AlertDescription>
            </Alert>
          ) : null}

          {status === "approved" ? (
            <Alert>
              <HugeiconsIcon icon={DeliveryBox01Icon} strokeWidth={2} />
              <AlertTitle>Klaar voor ophalen</AlertTitle>
              <AlertDescription>
                Goedgekeurd: de goederen zijn gereserveerd en klaargezet.
                Bevestig “Opgehaald” pas als de aanvrager ze heeft meegenomen.
              </AlertDescription>
            </Alert>
          ) : null}

          {status === "completed" ? (
            <Alert>
              <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} />
              <AlertTitle>Opgehaald</AlertTitle>
              <AlertDescription>
                Deze aanvraag is volledig afgerond. De items zijn opgehaald; er
                is geen actie meer nodig.
              </AlertDescription>
            </Alert>
          ) : null}

          {request.requestDescription ? (
            <section className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-900/40">
              <h3 className="text-xs font-bold tracking-wide text-slate-400 uppercase">
                Toelichting / behoefte
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                {request.requestDescription}
              </p>
            </section>
          ) : (
            <p className="text-sm text-slate-400">Geen toelichting opgegeven.</p>
          )}

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-700">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-sky-800 dark:bg-slate-900">
                <HugeiconsIcon
                  icon={UserIcon}
                  strokeWidth={2}
                  className="size-4"
                />
              </span>
              <div className="min-w-0">
                <DetailRow
                  label="Aanvrager"
                  value={request.requesterName ?? "Onbekend"}
                />
                {request.requesterEmail ? (
                  <p className="mt-0.5 truncate text-xs text-slate-400">
                    {request.requesterEmail}
                  </p>
                ) : null}
              </div>
            </div>
            <DetailRow
              label="Aangemaakt"
              value={formatRequestWhen(request.createdAt)}
            />
            <DetailRow
              label="Laatst bijgewerkt"
              value={formatRequestWhen(request.updatedAt)}
            />
            <DetailRow
              label="Prioriteit"
              value={
                request.isUrgent ? "Spoed — hoogste prioriteit" : "Normaal"
              }
            />
          </section>

          {actionError ? (
            <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
              {actionError}
            </p>
          ) : null}
        </div>

        <DialogFooter className="gap-2 border-t border-slate-100 bg-slate-50/80 px-5 py-4 dark:border-slate-700 dark:bg-slate-900/40 sm:flex-row sm:justify-end">
          {status === "open" ? (
            <Button
              type="button"
              disabled={busy || short}
              onClick={() => onApprove(request.requestId)}
              className="h-11 w-full gap-2 rounded-xl bg-sky-700 font-semibold hover:bg-sky-800 sm:w-auto"
            >
              <HugeiconsIcon
                icon={Tick02Icon}
                strokeWidth={2}
                className="size-4"
              />
              {busy ? "Bezig..." : "Goedkeuren & klaarzetten"}
            </Button>
          ) : null}
          {status === "approved" ? (
            <Button
              type="button"
              disabled={busy}
              onClick={() => onComplete(request.requestId)}
              className="h-11 w-full gap-2 rounded-xl bg-emerald-700 font-semibold hover:bg-emerald-800 sm:w-auto"
            >
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                strokeWidth={2}
                className="size-4"
              />
              {busy ? "Bezig..." : "Opgehaald — afhandelen"}
            </Button>
          ) : null}
          {status === "completed" ? (
            <p className="w-full text-center text-sm text-emerald-700 sm:text-right">
              Opgehaald — geen verdere actie.
            </p>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
