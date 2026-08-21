import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  Mail01Icon,
  Shield01Icon,
  Tick02Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { apiClient } from "../config/api";
import { FormInput } from "../components/global/form-input";
import { LoadingSpinner } from "../components/global/loading-spinner";
import { Button } from "../components/ui/button";
import { roleLabel } from "../lib/roles";
import { cn } from "../lib/utils";

type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  roleId?: number | null;
  roleName?: string | null;
  createdAt?: string | null;
};

type SessionPayload = {
  user: SessionUser;
};

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("nl-NL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ProfileDetailRow({
  icon,
  label,
  value,
  last,
}: {
  icon: typeof Mail01Icon;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 px-1 py-3 sm:px-2">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-800 dark:bg-sky-950/40 dark:text-sky-200">
        <HugeiconsIcon icon={icon} size={18} strokeWidth={2} />
      </span>
      <div
        className={cn(
          "min-w-0 flex-1",
          !last && "border-b border-slate-100 pb-3 dark:border-slate-700/80",
        )}
      >
        <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm font-semibold text-rkz-navy dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

export function ProfielPage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string }>({});
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiClient("/sessions/me")
      .then((result) => {
        const sessionUser = (result as SessionPayload).user;
        setUser(sessionUser);
        setName(sessionUser.name);
        setEmail(sessionUser.email);
      })
      .catch(() => setError("Profielgegevens konden niet worden geladen."))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setSuccess(false);

    const nextErrors: typeof fieldErrors = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (trimmedName.length < 2) nextErrors.name = "Naam moet minimaal 2 tekens bevatten";
    if (!trimmedEmail) {
      nextErrors.email = "E-mailadres is verplicht";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = "Ongeldig e-mailadres";
    }
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      const result = (await apiClient("/users/me/profile", {
        method: "PATCH",
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail }),
      })) as { user: Pick<SessionUser, "name" | "email"> };
      setUser((current) => (current ? { ...current, ...result.user } : current));
      setName(result.user.name);
      setEmail(result.user.email);
      setSuccess(true);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Profiel wijzigen mislukt.";
      if (message.toLowerCase().includes("in gebruik")) {
        setFieldErrors({ email: "Dit e-mailadres is al in gebruik" });
      } else {
        setFormError(message);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Profiel laden..." />;
  }

  if (error || !user) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-6 text-center">
          <p className="text-sm text-red-600">
            {error || "Geen gebruiker gevonden."}
          </p>
        </div>
      </div>
    );
  }

  const role = roleLabel(user.roleName);
  const initials = initialsFromName(user.name);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 sm:p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-rkz-navy dark:text-white">
          Profiel
        </h1>
        <p className="text-sm text-slate-500">Je accountgegevens</p>
      </header>

      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div
          className="relative h-28 bg-gradient-to-br from-sky-600 via-sky-500 to-teal-500 sm:h-32"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.15),transparent_40%)]" />
        </div>

        <div className="relative px-5 pb-6 sm:px-7">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-rkz-navy text-xl font-bold tracking-wide text-white shadow-md sm:size-24 sm:text-2xl dark:border-slate-800">
                {user.image ? (
                  <img
                    src={user.image}
                    alt=""
                    className="size-full rounded-[0.85rem] object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <div className="min-w-0 pb-1">
                <h2 className="truncate text-xl font-bold text-rkz-navy sm:text-2xl dark:text-white">
                  {user.name}
                </h2>
                <p className="truncate text-sm text-slate-500">{user.email}</p>
              </div>
            </div>

            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-900 ring-1 ring-sky-100 dark:bg-sky-950/50 dark:text-sky-100 dark:ring-sky-900">
              <HugeiconsIcon icon={Shield01Icon} size={14} strokeWidth={2} />
              {role}
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-1 flex items-center gap-2 px-1 sm:px-2">
          <HugeiconsIcon
            icon={UserIcon}
            size={18}
            strokeWidth={2}
            className="text-sky-700"
          />
          <h3 className="text-sm font-bold text-rkz-navy dark:text-white">
            Accountgegevens
          </h3>
        </div>

        <div className="mt-1">
          <ProfileDetailRow icon={UserIcon} label="Naam" value={user.name} />
          <ProfileDetailRow
            icon={Mail01Icon}
            label="E-mailadres"
            value={user.email}
          />
          <ProfileDetailRow icon={Shield01Icon} label="Rol" value={role} />
          <ProfileDetailRow
            icon={Calendar03Icon}
            label="Lid sinds"
            value={formatDate(user.createdAt)}
            last
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-4 flex items-center gap-2 px-1 sm:px-2">
          <HugeiconsIcon icon={UserIcon} size={18} strokeWidth={2} className="text-sky-700" />
          <div>
            <h3 className="text-sm font-bold text-rkz-navy dark:text-white">Profiel bewerken</h3>
            <p className="text-xs text-slate-500">Je kunt alleen je naam en e-mailadres wijzigen.</p>
          </div>
        </div>

        <form className="space-y-4 px-1 sm:px-2" onSubmit={(event) => void handleSubmit(event)}>
          <FormInput label="Naam" name="profile-name" value={name} onChange={setName} required error={fieldErrors.name} autoComplete="name" />
          <FormInput label="E-mailadres" name="profile-email" type="email" value={email} onChange={setEmail} required error={fieldErrors.email} autoComplete="email" />
          {formError ? <p className="text-sm text-rose-600" role="alert">{formError}</p> : null}
          {success ? <p className="text-sm text-emerald-600" role="status">Profiel is opgeslagen.</p> : null}
          <Button type="submit" disabled={saving} className="h-10 gap-2 rounded-xl bg-sky-800 px-4 text-sm font-semibold text-white hover:bg-sky-900">
            {saving ? "Opslaan..." : "Profiel opslaan"}
            {!saving ? <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-4" /> : null}
          </Button>
        </form>
      </section>
    </div>
  );
}
