import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "../components/footer";

import "../css/index.css";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

//#########################################################################
//Local Components
//#########################################################################
function SpoedAanvraag() {
  return <div></div>;
}

function KritiekeVoorraadOverzicht() {
  return <div></div>;
}

function KritikeMeldingen() {
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
          <h1>Dashboard</h1>
        </div>

        <div>
          <SpoedAanvraag />
        </div>

        <div>
          <KritiekeVoorraadOverzicht />
        </div>

        <div>
          <KritikeMeldingen />
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}
