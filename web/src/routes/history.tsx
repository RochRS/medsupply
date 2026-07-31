import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "../components/global/footer.tsx";
import { HistoryDisplay } from "../module/history-module.tsx";

import "../css/history.css";

export const Route = createFileRoute("/history")({   // ← was "/geschiedenis"
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="min-h-screen bg-rkz-bg dark:bg-slate-900">
        <div className="text-center pt-4 pb-3">
          <h1 className="text-2xl font-bold text-rkz-navy dark:text-white">Geschiedenis</h1>
          <p className="text-sm text-slate-500">
            Overzicht van alle activiteiten die hebben plaatsgevonden.
          </p>
        </div>

        <HistoryDisplay />
      </div>

      <Footer />
    </div>
  );
}