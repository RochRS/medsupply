import { createFileRoute } from "@tanstack/react-router";
import { AanvragenPage } from "../module/aanvragen-module.tsx";

export const Route = createFileRoute("/aanvragen")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-full bg-rkz-bg dark:bg-slate-900">
      <AanvragenPage />
    </div>
  );
}
