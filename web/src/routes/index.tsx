import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "../components/global/footer.tsx";

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
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-sky-700 to-slate-600">
        <div className="flex flex-col items-center gap-6 max-w-sm w-full px-6">
          <HospitalIcon />

          <div className="bg-white w-full rounded-xl shadow-lg p-6 flex flex-col gap-4">
            <UserInputFields />
            <SubmitLoginRequestButton />
          </div>
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}
