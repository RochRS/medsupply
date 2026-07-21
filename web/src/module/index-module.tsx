import { Button } from "../components/ui/button";
import { FormInput } from "../components/global/form-input";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { signIn } from "../lib/auth-client";
import { loginSchema } from "../schemas/login";

export function HospitalIcon() {
  return (
    <div>
      <div>
        <img />
      </div>

      <div>
        <h1>MedSupply</h1>
        <p>Voorraadbeheer Systeem voor Medische Supplies</p>
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

  // Validate locally, then sign in with better-auth
  const sendLoginRequest = async () => {
    onError("");
    onFieldErrors({});

    // Show field errors before calling the API
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
      // Creates a session cookie on success
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
    <Button onClick={sendLoginRequest} disabled={loading}>
      {loading ? "Bezig..." : "Login"}
    </Button>
  );
}
