import { createFileRoute } from "@tanstack/react-router";

import "../css/index.css";
import { Footer } from "../components/footer";

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
});
//#########################################################################
//Local Components
//#########################################################################
function Settings() {
  return <div></div>;
}

//#########################################################################
//Page
//#########################################################################

function RouteComponent() {
  return (
    <div>
      <div className="text-center">
        <div>
          <h1>Instellingen</h1>
          <p>Hier kunnen de instellingen aangepast worden.</p>
        </div>

        <div>
          <Settings />
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}
