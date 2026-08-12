import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import { SquareLock01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { FormInput } from "@/components/global/form-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiClient } from "@/config/api";
import { BrandHeader } from "@/module/index-module";

export const Route = createFileRoute("/change-password")({
  component: ChangePasswordPage,
});

function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setFormError("");
    const next: typeof errors = {};
    if (!currentPassword) {
      next.currentPassword = "Vul je tijdelijke wachtwoord in";
    }
    if (newPassword.length < 8) {
      next.newPassword = "Nieuw wachtwoord moet minimaal 8 tekens zijn";
    }
    if (confirmPassword !== newPassword) {
      next.confirmPassword = "Wachtwoorden komen niet overeen";
    }
    if (currentPassword && newPassword && currentPassword === newPassword) {
      next.newPassword = "Kies een ander wachtwoord dan het tijdelijke";
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
      // Full reload so session/user state picks up mustChangePassword=false
      window.location.assign("/dashboard");
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
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-b from-sky-50 via-sky-100 to-sky-200/80 px-4 py-10">
      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-8">
        <BrandHeader />

        <Card className="w-full rounded-3xl border-0 bg-white py-8 shadow-[0_10px_40px_-12px_rgba(14,116,144,0.18)] ring-0 [--card-spacing:--spacing(6)]">
          <CardHeader className="px-8 text-left">
            <CardTitle className="text-xl font-bold tracking-tight text-sky-950">
              Wachtwoord wijzigen
            </CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Je logt voor het eerst in met een tijdelijk wachtwoord. Kies nu een
              eigen wachtwoord om door te gaan.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-5 px-8">
            <FormInput
              label="Tijdelijk / huidig wachtwoord"
              name="currentPassword"
              type="password"
              value={currentPassword}
              onChange={setCurrentPassword}
              required
              error={errors.currentPassword}
              autoComplete="current-password"
              className="h-11 rounded-xl"
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
              className="h-11 rounded-xl"
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
              className="h-11 rounded-xl"
            />

            {formError ? (
              <p className="text-sm text-rose-600" role="alert">
                {formError}
              </p>
            ) : null}

            <Button
              type="button"
              size="lg"
              disabled={loading}
              onClick={() => void handleSubmit()}
              className="h-11 w-full gap-2 rounded-xl bg-sky-800 text-sm font-semibold text-white hover:bg-sky-900"
            >
              {loading ? "Bezig..." : "Wachtwoord opslaan"}
              {!loading ? (
                <HugeiconsIcon
                  icon={Tick02Icon}
                  strokeWidth={2}
                  className="size-4"
                />
              ) : null}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
