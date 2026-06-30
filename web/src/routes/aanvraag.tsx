import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "../components/footer";

import "../css/index.css";

export const Route = createFileRoute("/aanvraag")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div></div>
      <Footer />
    </div>
  );
}
