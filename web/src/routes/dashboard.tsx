import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "../components/global/footer.tsx";

import {
  SpoedAanvraag,
  KritiekeVoorraadOverzicht,
  KritikeMeldingen,
} from "../module/dashboard-module.tsx";

import "../css/dashboard.css";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

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
