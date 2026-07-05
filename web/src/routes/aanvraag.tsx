import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "../components/footer";

import { NormaleAanvraagFormulier } from "../module/aanvraag-module.tsx";

import "../css/aanvraag.css";

export const Route = createFileRoute("/aanvraag")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div>
        <div className="text-center">
          <h1>Aanvraag</h1>
          <p>Voor Reguliere Voorraadaanvragen (Zonder Spoed)</p>
        </div>

        <div>
          <NormaleAanvraagFormulier />
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}
