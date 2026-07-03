import { createFileRoute } from "@tanstack/react-router";

import "../css/index.css";
import { Footer } from "../components/footer";

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
