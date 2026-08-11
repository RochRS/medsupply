import { createFileRoute } from "@tanstack/react-router";
import { ProfielPage } from "../module/profiel-module.tsx";

export const Route = createFileRoute("/profiel")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-full bg-rkz-bg dark:bg-slate-900">
      <ProfielPage />
    </div>
  );
}
