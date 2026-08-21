import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import { SquareLock01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { LoadingSpinner } from "../components/global/loading-spinner";
import { FormInput } from "../components/global/form-input";
import { Button } from "../components/ui/button";
import { useAppUser } from "../lib/roles";
import { useAppSettings } from "../lib/app-settings";
import { apiClient } from "../config/api";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function AppNameSettings() {
  const { appName, setAppName, refresh } = useAppSettings();
  const [value, setValue] = useState(appName);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValue(appName);
  }, [appName]);

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Naam mag niet leeg zijn");
      return;
    }

    setLoading(true);
    try {
      const result = (await apiClient("/settings", {
        method: "PATCH",
        body: JSON.stringify({ appName: trimmed }),
      })) as { appName?: string };
      if (result.appName) {
        setAppName(result.appName);
        setValue(result.appName);
      }
      await refresh();
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Naam wijzigen mislukt. Probeer opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 max-w-sm">
      <h2 className="text-sm font-semibold text-sky-950 dark:text-sky-50">
        Applicatienaam
      </h2>
      <div className="mt-3 flex flex-col gap-4">
        <FormInput
          label="Naam van de applicatie"
          name="appName"
          value={value}
          onChange={setValue}
          required
          error={error}
          placeholder="MedSupply"
        />

        {success ? (
          <p className="text-sm text-emerald-600" role="status">
            Naam is gewijzigd.
          </p>
        ) : null}

        <Button
          type="button"
          disabled={loading}
          onClick={() => void handleSubmit()}
          className="h-10 w-fit gap-2 rounded-xl bg-sky-800 text-sm font-semibold text-white hover:bg-sky-900"
        >
          {loading ? "Bezig..." : "Naam opslaan"}
          {!loading ? (
            <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-4" />
          ) : null}
        </Button>
      </div>
    </div>
  );
}

function PasswordSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setFormError("");
    setSuccess(false);
    const next: typeof errors = {};
    if (!currentPassword) {
      next.currentPassword = "Vul je huidige wachtwoord in";
    }
    if (newPassword.length < 8) {
      next.newPassword = "Nieuw wachtwoord moet minimaal 8 tekens zijn";
    }
    if (confirmPassword !== newPassword) {
      next.confirmPassword = "Wachtwoorden komen niet overeen";
    }
    if (currentPassword && newPassword && currentPassword === newPassword) {
      next.newPassword = "Kies een ander wachtwoord dan je huidige";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      await apiClient("/users/me/password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.toLowerCase().includes("onjuist") || msg.includes("incorrect")) {
        setErrors({ currentPassword: "Huidig wachtwoord is onjuist" });
      } else {
        setFormError(msg || "Wachtwoord wijzigen mislukt. Probeer opnieuw.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 max-w-sm border-t border-sky-100 pt-6 dark:border-slate-800">
      <h2 className="text-sm font-semibold text-sky-950 dark:text-sky-50">
        Wachtwoord wijzigen
      </h2>
      <div className="mt-3 flex flex-col gap-4">
        <FormInput
          label="Huidig wachtwoord"
          name="currentPassword"
          type="password"
          value={currentPassword}
          onChange={setCurrentPassword}
          required
          error={errors.currentPassword}
          autoComplete="current-password"
          icon={
            <HugeiconsIcon
              icon={SquareLock01Icon}
              strokeWidth={1.8}
              className="size-4 text-sky-600"
            />
          }
        />
        <FormInput
          label="Nieuw wachtwoord"
          name="newPassword"
          type="password"
          value={newPassword}
          onChange={setNewPassword}
          required
          error={errors.newPassword}
          autoComplete="new-password"
          placeholder="Minimaal 8 tekens"
        />
        <FormInput
          label="Bevestig nieuw wachtwoord"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          required
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        {formError ? (
          <p className="text-sm text-rose-600" role="alert">
            {formError}
          </p>
        ) : null}
        {success ? (
          <p className="text-sm text-emerald-600" role="status">
            Wachtwoord is gewijzigd.
          </p>
        ) : null}

        <Button
          type="button"
          disabled={loading}
          onClick={() => void handleSubmit()}
          className="h-10 w-fit gap-2 rounded-xl bg-sky-800 text-sm font-semibold text-white hover:bg-sky-900"
        >
          {loading ? "Bezig..." : "Wachtwoord opslaan"}
          {!loading ? (
            <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-4" />
          ) : null}
        </Button>
      </div>
    </div>
  );
}

function AdminSettings() {
  return (
    <>
      <AppNameSettings />
      <PasswordSettings />
    </>
  );
}

function ApothekerSettings() {
  return (
    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
      Er zijn geen specifieke instellingen voor Apotheker.
    </p>
  );
}

function VerplegingSettings() {
  return (
    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
     Er zijn geen specifieke instellingen Verpleging.
    </p>
  );
}

function SettingsPage() {
  const { role, loading } = useAppUser();

  return (
    <div className="min-h-full bg-rkz-bg dark:bg-slate-900">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-sky-950 dark:text-sky-50">
            Instellingen
          </h1>
          {loading ? (
            <div className="mt-2">
              <LoadingSpinner label="Instellingen laden..." />
            </div>
          ) : role === "admin" ? (
            <AdminSettings />
          ) : role === "apotheker" ? (
            <ApothekerSettings />
          ) : (
            <VerplegingSettings />
          )}
        </header>
      </div>
    </div>
  );
}
