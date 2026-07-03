import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "../components/footer";

import "../css/index.css";

export const Route = createFileRoute("/aanvraag")({
  component: RouteComponent,
});

//#########################################################################
//Local Components
//#########################################################################
function NormaleAanvraagSelectors() {
  return <div></div>;
}

function NormaleAanvraagUrgentieSelector() {
  return <div></div>;
}

function OpmerkingenTextArea() {
  return <div></div>;
}

function NormaleAanvraagButtons() {
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
          <h1>Aanvraag</h1>
          <p>Voor Reguliere Voorraadaanvragen (Zonder Spoed)</p>
        </div>

        <div>
          <NormaleAanvraagSelectors />
        </div>

        <div>
          <NormaleAanvraagUrgentieSelector />
        </div>

        <div>
          <OpmerkingenTextArea />
        </div>

        <div>
          <NormaleAanvraagButtons />
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}
