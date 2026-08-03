import { createFileRoute } from "@tanstack/react-router";
import {
  ProfielInformation,
  ProfielPageButtons,
} from "../module/profiel-module.tsx";

export const Route = createFileRoute("/profiel")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
<<<<<<< HEAD
    <div>
      <div>
        <div className="text-center">
          <h1>Profiel</h1>
          <p>Hier kan je je profiel aanpassen.</p>
        </div>

        <div>
          {/* <image src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" className="avatar" /> */}
        </div>

        <div>
          <ProfielInformation />
        </div>

        <div>
          <ProfielPageButtons />
        </div>
=======
    <div className="min-h-full bg-rkz-bg dark:bg-slate-900">
      <div className="py-6 text-center">
        <h1 className="text-2xl font-bold text-rkz-navy dark:text-white">
          Profiel
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Hier kan je je profiel aanpassen.
        </p>
>>>>>>> c3807e9 (feat: polish ui and dashboard)
      </div>

      <div className="flex flex-col gap-4 px-4 pb-8">
        <ProfielInformation />
        <ProfielPageButtons />
      </div>
    </div>
  );
}
