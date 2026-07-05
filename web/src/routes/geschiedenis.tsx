import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "../components/footer";

import { GeschiedenisDisplay } from "../module/geschiedenis-module.tsx";

import "../css/geschiedenis.css";

export const Route = createFileRoute("/geschiedenis")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div>
        <div className="text-center">
          <h1>Geschiedenis</h1>
          <p>Overzicht van alle activiteiten hebben plaatsgevonden.</p>
        </div>

        <div>
          <GeschiedenisDisplay />
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}
