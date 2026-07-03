import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "../components/footer";

import "../css/geschiedenis.css";

export const Route = createFileRoute("/geschiedenis")({
  component: RouteComponent,
});
//#########################################################################
//Local Components
//#########################################################################
function GeschiedenisFilters() {
  return <div></div>;
}

function GeschiedenisDisplayTable() {
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
          <h1>Geschiedenis</h1>
          <p>Overzicht van alle activiteiten hebben plaatsgevonden.</p>
        </div>

        <div>
          <GeschiedenisFilters />
        </div>
        <div>
          <GeschiedenisDisplayTable />
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}
