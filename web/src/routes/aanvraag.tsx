import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "../components/global/footer.tsx";

import { NormaleAanvraagFormulier } from "../module/aanvraag-module.tsx";

import "../css/aanvraag.css";

export const Route = createFileRoute("/aanvraag")({
  component: RouteComponent,
});



function RouteComponent() {
  return (
    <div>
      <div className="min-h-screen bg-gradient-to-b from-slate-100 to-teal-50">
        <div className="text-center py-3">
          <h1 className="text-2xl font-bold text-teal-800">Aanvraag</h1>
        </div>

        <div className="px-4 pb-8 flex justify-center">
          <NormaleAanvraagFormulier />
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}