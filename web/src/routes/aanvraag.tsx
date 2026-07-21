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
      <div className="min-h-screen bg-teal-800">
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold text-white">Aanvraag</h1>
          <p className="text-teal-100 text-sm">Voor Reguliere Voorraadaanvragen (Zonder Spoed)</p>
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