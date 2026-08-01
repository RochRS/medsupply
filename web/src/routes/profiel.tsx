import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "../components/global/footer.tsx";

import {
  ProfielInformation,
  ProfielPageButtons,
} from "../module/profiel-module.tsx";

import "../css/profiel.css";

export const Route = createFileRoute("/profiel")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="min-h-height bg-rkz-bg dark:bg-slate-900">
        <div className="text-center py-6">
          <h1 className="text-2x1 font-bold text-rkz-navy dark:text-white">Profiel</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Hier kan je je profiel aanpassen.</p>
        </div>

        <div>
          {/* <image src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" className="avatar" /> */}
        </div>

        <div className="flex flex-col gap-4 px-4 pb-8">
          <ProfielInformation />
          <ProfielPageButtons />
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}
