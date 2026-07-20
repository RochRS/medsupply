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

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col gap-4 max-w-sm dark:bg-slate-800 p-6 rounded-lg text-center size-80">
          <div className="text-red-900">
            <HospitalIcon />
          </div>

          <div>
            <UserInputFields
              email={email}
              password={password}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              errors={fieldErrors}
            />
          </div>

          {formError && (
            <p className="text-sm text-red-500 text-left">{formError}</p>
          )}

          <div className="text-blue-600 ">
            <SubmitLoginRequestButton
              email={email}
              password={password}
              onError={setFormError}
              onFieldErrors={setFieldErrors}
            />
          </div>
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}
