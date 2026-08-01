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

        <HistoryDisplay />
      </div>

      <Footer />
    </div>
  );
}