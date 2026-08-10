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
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Index,
});

const DEMO_PASSWORD = "Test1234!";

const DEMO_ACCOUNTS = [
  {
    id: "apotheker",
    label: "Apotheker",
    email: "apotheker@medsupply.com",
    password: DEMO_PASSWORD,
  },
  {
    id: "verpleging",
    label: "Verpleging",
    email: "verpleging@medsupply.com",
    password: DEMO_PASSWORD,
  },
] as const;

type DemoId = (typeof DEMO_ACCOUNTS)[number]["id"];

function Index() {
  const defaultDemo = DEMO_ACCOUNTS[0];
  const [activeDemo, setActiveDemo] = useState<DemoId>(defaultDemo.id);
  const [email, setEmail] = useState(defaultDemo.email);
  const [password, setPassword] = useState(defaultDemo.password);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const fillDemo = (id: DemoId) => {
    const account = DEMO_ACCOUNTS.find((a) => a.id === id);
    if (!account) return;
    setActiveDemo(id);
    setEmail(account.email);
    setPassword(account.password);
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
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-slate-500">
                Demo-accounts (auto ingevuld)
              </p>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map((account) => (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => fillDemo(account.id)}
                    className={cn(
                      "rounded-xl border px-3 py-2.5 text-left transition-colors",
                      activeDemo === account.id
                        ? "border-sky-300 bg-sky-50 text-sky-950"
                        : "border-slate-200 bg-slate-50/80 text-slate-600 hover:border-sky-200 hover:bg-sky-50/60",
                    )}
                  >
                    <span className="block text-sm font-semibold">
                      {account.label}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-slate-400">
                      {account.email}
                    </span>
                  </button>
                ))}
              </div>
            </div>

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
          </CardContent>
        </Card>

        <p className="pt-2 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} MedSupply
        </p>
      </div>
    </div>
  );
}
