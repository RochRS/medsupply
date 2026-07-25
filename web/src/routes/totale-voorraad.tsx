import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "../components/global/footer.tsx";
import { TotaleVoorraadPage } from "../module/totale-voorraad-module.tsx";

import "../css/totale-voorraad.css";

export const Route = createFileRoute("/totale-voorraad")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <TotaleVoorraadPage />
      <Footer />
    </div>
  );
}
