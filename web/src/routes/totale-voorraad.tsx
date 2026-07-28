import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "../components/global/footer.tsx";

import {
  TotaleVoorraadOverzichtStats,
  TotaleVoorraadSearchbar,
  TotaleVoorraadDisplayTable,
} from "../module/totale-voorraad-module.tsx";

import "../css/totale-voorraad.css";

export const Route = createFileRoute("/totale-voorraad")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div>
        <div className="text-center">
          <h1>Totale Voorraad</h1>
          <p>Overzicht van de totale voorraad in het magazijn.</p>
        </div>

        <div>
          <TotaleVoorraadOverzichtStats />
        </div>

        <div>
          <TotaleVoorraadSearchbar />
        </div>

        <div>
          <TotaleVoorraadDisplayTable />
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}
