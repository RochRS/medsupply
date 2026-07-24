import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "../components/global/footer.tsx";
import { GeschiedenisDisplay } from "../module/geschiedenis-module.tsx";

import "../css/geschiedenis.css";

export const Route = createFileRoute("/geschiedenis")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="text-center pt-4">
        <h1 className="text-2xl font-semibold">Geschiedenis</h1>
        <p className="text-sm text-gray-500">
          Overzicht van alle activiteiten die hebben plaatsgevonden.
        </p>
      </div>

      <GeschiedenisDisplay />

      <Footer />
    </div>
  );
}
