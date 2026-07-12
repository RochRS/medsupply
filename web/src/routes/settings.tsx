import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "../components/global/footer.tsx";

import { Settings } from "../module/settings-module.tsx";

import "../css/settings.css";

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
});

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
