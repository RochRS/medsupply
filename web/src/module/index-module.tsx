import { Button } from "../components/ui/button";
import { FormInput } from "../components/global/form-input";
import { useState } from "react";
import logo from "../assets/rkz-whitebg.jpeg";
import { useNavigate } from "@tanstack/react-router";
import { signIn } from "../lib/auth-client";
import { loginSchema } from "../schemas/login";

export function HospitalIcon() {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="bg-indigo-800 rounded-2xl p-4">
        <img src={logo} alt="RKZ Logo" className="w-12 h-12" />
      </div>

      <div>
        <h1 className="text-white text-2xl font-bold">MedSupply</h1>
        <p className="text-slate-200 text-sm">Voorraadbeheer Systeem voor Medische Supplies</p>
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
    <div className="flex flex-col gap-3">
      <FormInput
        label="Email"
        name="email"
        type="email"
        placeholder="jouw@rkz.sr"
        value={email}
        onChange={onEmailChange}
        error={errors?.email}
      />
      <FormInput
        label="Wachtwoord"
        name="password"
        type="password"
        placeholder=""
        value={password}
        onChange={onPasswordChange}
        error={errors?.password}
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

      await navigate({ to: "/dashboard" });
    } catch {
      onError("Kan geen verbinding maken met de server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <Button onClick={sendLoginRequest} disabled={loading}>
        {loading ? "Bezig..." : "Login"}
      </Button>
      <p className="text-sm text-red-500 text-center">
        Let op: Alleen medewerkers met een geldig ziekenhuis e-mailadres kunnen inloggen.
      </p>
    </div>
  );
}