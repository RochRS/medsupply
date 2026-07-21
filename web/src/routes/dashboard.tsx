import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "../components/global/footer.tsx";

import {
  SpoedAanvraag,
  KritiekeVoorraadOverzicht,
  KritikeMeldingen,
} from "../module/dashboard-module.tsx";

import "../css/dashboard.css";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="min-h-screen bg-slate-50">
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 max-w-7xl mx-auto">
          <SpoedAanvraag />
          <KritiekeVoorraadOverzicht />
          <KritikeMeldingen />
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}
