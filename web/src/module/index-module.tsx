import { FormInput } from "@/components/global/form-input";
import { Button } from "@/components/ui/button";
import {
  Login01Icon,
  Mail01Icon,
  SquareLock01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import logo from "../assets/rkz-logo.png";
import { signIn } from "../lib/auth-client";
import { apiClient } from "../config/api";
import { loginSchema } from "../schemas/login";
import { useAppSettings } from "../lib/app-settings";

export function BrandHeader() {
  const { appName } = useAppSettings();
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <img
        src={logo}
        alt="St. Vincentius Ziekenhuis"
        className="h-16 w-auto object-contain sm:h-20"
      />
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-sky-950 sm:text-4xl">
          {appName}
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Voorraadbeheer voor medische supplies
        </p>
      </div>
    </div>
  );
}

type UserInputFieldsProps = {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  errors?: { email?: string; password?: string };
};

export function UserInputFields({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  errors,
}: UserInputFieldsProps) {
  return (
    <div className="flex flex-col gap-5">
      <FormInput
        label="E-mail"
        name="email"
        type="email"
        placeholder="jouw@rkz.sr"
        value={email}
        onChange={onEmailChange}
        error={errors?.email}
        autoComplete="email"
        required
        className="h-11 rounded-xl border-sky-200 bg-white shadow-none"
        icon={
          <HugeiconsIcon
            icon={Mail01Icon}
            strokeWidth={1.8}
            className="size-4 text-sky-600"
          />
        }
      />
      <FormInput
        label="Wachtwoord"
        name="password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={onPasswordChange}
        error={errors?.password}
        autoComplete="current-password"
        required
        className="h-11 rounded-xl border-sky-200 bg-white shadow-none"
        icon={
          <HugeiconsIcon
            icon={SquareLock01Icon}
            strokeWidth={1.8}
            className="size-4 text-sky-600"
          />
        }
      />
    </div>
  );
}

type SubmitLoginRequestButtonProps = {
  email: string;
  password: string;
  onError: (message: string) => void;
  onFieldErrors: (errors: { email?: string; password?: string }) => void;
};

export function SubmitLoginRequestButton({
  email,
  password,
  onError,
  onFieldErrors,
}: SubmitLoginRequestButtonProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const sendLoginRequest = async () => {
    onError("");
    onFieldErrors({});

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key === "email" || key === "password") {
          fieldErrors[key] = issue.message;
        }
      }
      onFieldErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn.email({
        email: parsed.data.email.trim().toLowerCase(),
        password: parsed.data.password,
      });

      if (error) {
        onError(error.message || "Inloggen mislukt. Controleer je gegevens.");
        return;
      }

      try {
        const me = (await apiClient("/sessions/me")) as {
          user?: { mustChangePassword?: boolean };
        };
        if (me.user?.mustChangePassword) {
          await navigate({ to: "/change-password" });
          return;
        }
      } catch {
        // fall through to dashboard
      }

      await navigate({ to: "/dashboard" });
    } catch {
      onError("Kan geen verbinding maken met de server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      size="lg"
      onClick={sendLoginRequest}
      disabled={loading}
      className="h-11 w-full gap-2 rounded-xl bg-sky-800 text-sm font-semibold text-white hover:bg-sky-900"
    >
      {loading ? "Bezig..." : "Inloggen"}
      {!loading ? (
        <HugeiconsIcon icon={Login01Icon} strokeWidth={2} className="size-4" />
      ) : null}
    </Button>
  );
}
