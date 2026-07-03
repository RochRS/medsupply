import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "../components/footer";

import "../css/totale-voorraad.css";

export const Route = createFileRoute("/totale-voorraad")({
  component: RouteComponent,
});

//#########################################################################
//Local Components
//#########################################################################
function TotaleVoorraadOverzichtStats() {
  return <div></div>;
}

function TotaleVoorraadSearchbar() {
  return <div></div>;
}

function TotaleVoorraadDisplayTable() {
  return <div></div>;
}

//#########################################################################
//Page
//#########################################################################

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
