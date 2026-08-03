import { createFileRoute } from "@tanstack/react-router";
import { HistoryDisplay } from "../module/history-module.tsx";

export const Route = createFileRoute("/history")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-full bg-rkz-bg dark:bg-slate-900">
      <HistoryDisplay />
    </div>
  );
}
