import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Delete02Icon,
  PackageIcon,
  ShoppingBagAddIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { FormInput } from "../components/global/form-input";
import { DemoFillButton } from "../components/global/demo-fill-button";
import { demoRequestDetails } from "../lib/demo-form-data";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../components/ui/button";
import { useCart } from "../lib/cart";
import { apiClient } from "../config/api";
import { cn } from "../lib/utils";

const URGENTIE_OPTIES = [
  { value: "normaal", label: "Normaal (binnen 3–5 dagen)" },
  { value: "hoog", label: "Spoed (binnen 24 uur)" },
] as const;

const STEPS = [
  { id: 1, label: "Producten" },
  { id: 2, label: "Gegevens" },
] as const;

function Stepper({ step }: { step: 1 | 2 }) {
  return (
    <nav aria-label="Stappen" className="flex items-center gap-0">
      {STEPS.map((s, index) => {
        const done = step > s.id;
        const active = step === s.id;
        return (
          <div key={s.id} className="flex min-w-0 flex-1 items-center">
            <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-sm font-bold transition-colors",
                  done && "bg-sky-800 text-white",
                  active && "bg-sky-800 text-white ring-4 ring-sky-100",
                  !done && !active && "bg-slate-100 text-slate-400",
                )}
              >
                {done ? (
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    strokeWidth={2.5}
                    className="size-4"
                  />
                ) : (
                  s.id
                )}
              </span>
              <span
                className={cn(
                  "text-center text-xs font-medium",
                  active || done ? "text-sky-900" : "text-slate-400",
                )}
              >
                {s.label}
              </span>
            </div>
            {index < STEPS.length - 1 ? (
              <div
                className={cn(
                  "mb-5 h-0.5 min-w-6 flex-1 rounded-full",
                  step > s.id ? "bg-sky-800" : "bg-slate-200",
                )}
                aria-hidden
              />
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}

export function RequestForm() {
  const { items, productCount, totalCount, updateAmount, removeItem, clear } =
    useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [afdeling, setAfdeling] = useState("");
  const [urgentie, setUrgentie] = useState<"normaal" | "hoog">("normaal");
  const [opmerking, setOpmerking] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    afdeling?: string;
  }>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (items.length === 0 && !success) {
      setStep(1);
    }
  }, [items.length, success]);

  const goToStep2 = () => {
    if (items.length === 0) return;
    setError("");
    setFieldErrors({});
    setStep(2);
  };

  const handleVersturen = async () => {
    setError("");
    setSuccess(false);
    setFieldErrors({});

    if (items.length === 0) {
      setError("Voeg eerst producten toe via Supplies.");
      setStep(1);
      return;
    }
    if (!afdeling.trim()) {
      setFieldErrors({ afdeling: "Afdeling is verplicht" });
      return;
    }

    setLoading(true);
    const batchId = Math.floor(Date.now() / 1000);
    const urgent = urgentie === "hoog";
    const description = [
      `Afdeling: ${afdeling.trim()}`,
      opmerking.trim() || null,
    ]
      .filter(Boolean)
      .join(" — ");

    try {
      const path = urgent ? "/requests?urgent=1" : "/requests";
      await Promise.all(
        items.map((row) =>
          apiClient(path, {
            method: "POST",
            body: JSON.stringify({
              itemId: row.itemId,
              requestedAmount: row.amount,
              requestBatchId: batchId,
              requestDescriptionField: description,
            }),
          }),
        ),
      );
      clear();
      setSuccess(true);
      setStep(1);
      setAfdeling("");
      setOpmerking("");
      setUrgentie("normaal");
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Aanvraag kon niet worden geplaatst. Probeer opnieuw.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto w-full max-w-xl rounded-2xl border border-emerald-100 bg-white p-8 shadow-sm dark:border-emerald-900 dark:bg-slate-800">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40">
            <HugeiconsIcon
              icon={Tick02Icon}
              strokeWidth={2}
              className="size-7"
            />
          </span>
          <h1 className="text-xl font-bold text-rkz-navy dark:text-white">
            Aanvraag geplaatst
          </h1>
          <p className="text-sm text-slate-500">
            De apotheek heeft een melding ontvangen en verwerkt je aanvraag
            verder.
          </p>
          <div className="mt-4 flex w-full flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              className="h-11 flex-1 rounded-xl"
              onClick={() => {
                setSuccess(false);
                void navigate({ to: "/inventory" });
              }}
            >
              Nog een aanvraag
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 rounded-xl"
              onClick={() => void navigate({ to: "/mijn-aanvragen" })}
            >
              Naar mijn aanvragen
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-xl rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-800 dark:bg-slate-900">
          <HugeiconsIcon
            icon={ShoppingBagAddIcon}
            strokeWidth={2}
            className="size-7"
          />
        </div>
        <h1 className="text-xl font-bold text-rkz-navy dark:text-white">
          Mand is leeg
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Kies eerst een categorie en zet producten in de mand. Daarna plaats je
          hier de aanvraag in twee stappen.
        </p>
        <Button
          type="button"
          className="mt-6 h-11 rounded-xl px-6"
          onClick={() => void navigate({ to: "/inventory" })}
        >
          Naar supplies / categorieën
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-rkz-navy dark:text-white">
          Aanvraag plaatsen
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {step === 1
            ? "Controleer je producten en aantallen"
            : "Vul de gegevens in en verstuur de aanvraag"}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white px-4 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:px-6">
        <Stepper step={step} />
      </div>

      {step === 1 ? (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-rkz-navy dark:text-white">
              Producten in mand
            </h2>
            <p className="text-xs text-slate-400">
              {productCount} product{productCount === 1 ? "" : "en"} ·{" "}
              {totalCount} stuks
            </p>
          </div>
          <ul className="flex flex-col gap-2">
            {items.map((row) => (
              <li
                key={row.itemId}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 px-3 py-2.5 dark:border-slate-700"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-800 dark:bg-slate-900">
                  <HugeiconsIcon
                    icon={PackageIcon}
                    strokeWidth={2}
                    className="size-4"
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-rkz-navy dark:text-white">
                    {row.itemName}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Beschikbaar: {row.remainingAmount}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="sr-only" htmlFor={`qty-${row.itemId}`}>
                    Aantal
                  </label>
                  <input
                    id={`qty-${row.itemId}`}
                    type="number"
                    min={1}
                    max={Math.max(1, row.remainingAmount)}
                    value={row.amount}
                    onChange={(e) =>
                      updateAmount(row.itemId, Number(e.target.value) || 1)
                    }
                    className="h-9 w-16 rounded-lg border border-slate-200 bg-white px-2 text-center text-sm dark:border-slate-600 dark:bg-slate-900"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 rounded-lg p-0 text-red-600"
                    onClick={() => removeItem(row.itemId)}
                    aria-label="Verwijderen"
                  >
                    <HugeiconsIcon
                      icon={Delete02Icon}
                      strokeWidth={2}
                      className="size-4"
                    />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <button
              type="button"
              onClick={() => void navigate({ to: "/inventory" })}
              className="text-sm font-medium text-sky-800 hover:underline"
            >
              + Meer producten toevoegen
            </button>
          </div>

          <div className="mt-5 flex flex-row gap-2 border-t border-slate-100 pt-4 dark:border-slate-700">
            <Button
              type="button"
              variant="outline"
              className="h-11 min-w-0 flex-1 rounded-xl"
              onClick={() => clear()}
            >
              Mand legen
            </Button>
            <Button
              type="button"
              onClick={goToStep2}
              className="h-11 min-w-0 flex-1 gap-2 rounded-xl bg-sky-800 font-semibold hover:bg-sky-900"
            >
              Volgende
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                strokeWidth={2}
                className="size-4"
              />
            </Button>
          </div>
        </section>
      ) : (
        <section className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="rounded-xl border border-sky-100 bg-sky-50/70 px-3 py-2.5 text-sm text-sky-950 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-100">
            Je verstuurt{" "}
            <span className="font-semibold">
              {productCount} product{productCount === 1 ? "" : "en"}
            </span>{" "}
            ({totalCount} stuks).{" "}
            <button
              type="button"
              onClick={() => setStep(1)}
              className="font-medium text-sky-800 underline underline-offset-2 dark:text-sky-200"
            >
              Aanpassen
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-rkz-navy dark:text-white">
              Gegevens
            </h2>
            <DemoFillButton
              onClick={() => {
                const demo = demoRequestDetails();
                setAfdeling(demo.afdeling);
                setUrgentie(demo.urgentie);
                setOpmerking(demo.opmerking);
                setFieldErrors({});
                setError("");
              }}
            />
          </div>
          <FormInput
            label="Afdeling"
            name="afdeling"
            value={afdeling}
            onChange={setAfdeling}
            placeholder="Bijv. SEH, Cardiologie"
            required
            error={fieldErrors.afdeling}
            className="rounded-xl"
          />

          <div className="flex flex-col gap-2">
            <Label>Urgentie</Label>
            <RadioGroup
              value={urgentie}
              onValueChange={(v) =>
                setUrgentie(v === "hoog" ? "hoog" : "normaal")
              }
              className="gap-2"
            >
              {URGENTIE_OPTIES.map((opt) => (
                <label
                  key={opt.value}
                  htmlFor={`urgentie-${opt.value}`}
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm",
                    urgentie === opt.value
                      ? opt.value === "hoog"
                        ? "border-red-200 bg-red-50/80"
                        : "border-sky-200 bg-sky-50/80"
                      : "border-slate-100 hover:bg-slate-50 dark:border-slate-700",
                  )}
                >
                  <RadioGroupItem
                    value={opt.value}
                    id={`urgentie-${opt.value}`}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="opmerking">Toelichting (optioneel)</Label>
            <Textarea
              id="opmerking"
              value={opmerking}
              onChange={(e) => setOpmerking(e.target.value)}
              placeholder="Korte beschrijving van de behoefte"
              className="min-h-24 rounded-xl"
            />
          </div>

          {error ? (
            <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          ) : null}

          <div className="flex flex-row gap-2 border-t border-slate-100 pt-4 dark:border-slate-700">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => {
                setError("");
                setFieldErrors({});
                setStep(1);
              }}
              className="h-11 min-w-0 flex-1 gap-2 rounded-xl"
            >
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                strokeWidth={2}
                className="size-4 shrink-0"
              />
              Vorige
            </Button>
            <Button
              type="button"
              disabled={loading}
              onClick={() => void handleVersturen()}
              className="h-11 min-w-0 flex-[1.4] gap-1.5 rounded-xl bg-sky-800 px-2 text-sm font-semibold hover:bg-sky-900 sm:flex-1 sm:gap-2 sm:px-4 sm:text-base"
            >
              {loading ? "Bezig…" : "Aanvraag versturen"}
              {!loading ? (
                <HugeiconsIcon
                  icon={Tick02Icon}
                  strokeWidth={2}
                  className="size-4 shrink-0"
                />
              ) : null}
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
