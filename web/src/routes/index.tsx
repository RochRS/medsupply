import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BrandHeader,
  UserInputFields,
  SubmitLoginRequestButton,
} from "../module/index-module.tsx";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const fillDemoData = () => {
    setEmail("test@medsupply.com");
    setPassword("Test1234!");
    setFormError("");
    setFieldErrors({});
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-b from-sky-50 via-sky-100 to-sky-200/80 px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.75)_0%,rgba(125,211,252,0.25)_55%,rgba(56,189,248,0.2)_100%)]"
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-8">
        <BrandHeader />

        <Card className="w-full rounded-3xl border-0 bg-white py-8 shadow-[0_10px_40px_-12px_rgba(14,116,144,0.18)] ring-0 [--card-spacing:--spacing(6)]">
          <CardHeader className="px-8 text-left">
            <CardTitle className="text-xl font-bold tracking-tight text-sky-950">
              Welkom terug
            </CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Log in met je ziekenhuisaccount
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-6 px-8">
            <UserInputFields
              email={email}
              password={password}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              errors={fieldErrors}
            />

            {formError ? (
              <p className="text-sm text-rose-600" role="alert">
                {formError}
              </p>
            ) : null}

            <SubmitLoginRequestButton
              email={email}
              password={password}
              onError={setFormError}
              onFieldErrors={setFieldErrors}
            />

            <button
              type="button"
              onClick={fillDemoData}
              className="text-center text-xs text-slate-400 underline hover:text-slate-600"
            >
              Vul demo-gegevens in
            </button>
          </CardContent>
        </Card>

        <p className="pt-2 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} MedSupply
        </p>
      </div>
    </div>
  );
}
