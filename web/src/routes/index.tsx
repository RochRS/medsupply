import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "../components/global/footer.tsx";
import { useState } from "react";

import {
  HospitalIcon,
  UserInputFields,
  SubmitLoginRequestButton,
} from "../module/index-module.tsx";

import "../css/index.css";

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
    setEmail("demo@rkz.sr");
    setPassword("Demo1234!");
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-rkz-navy to-rkz-blue">
        <div className="flex flex-col items-center gap-5 max-w-sm w-full px-6">
          <HospitalIcon />

          <div className="bg-white w-full rounded-2xl shadow-xl p-7 flex flex-col gap-5">
            <UserInputFields
              email={email}
              password={password}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              errors={fieldErrors}
            />

            {formError && (
              <p className="text-sm text-rose-600 text-left">{formError}</p>
            )}

            <SubmitLoginRequestButton
              email={email}
              password={password}
              onError={setFormError}
              onFieldErrors={setFieldErrors}
            />

            <button
              onClick={fillDemoData}
              type="button"
              className="text-xs text-slate-400 hover:text-slate-600 underline"
            >
              Vul demo-gegevens in
            </button>
          </div>
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}