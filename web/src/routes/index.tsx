import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "../components/footer.tsx";

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
  console.log(import.meta.env.SERVER_URL);
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col gap-4 max-w-sm dark:bg-slate-800 p-6 rounded-lg text-center size-80">
          <div className="text-red-900">
            <HospitalIcon />
          </div>

          <div>
            <UserInputFields />
          </div>

          <div className="text-blue-600 ">
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
