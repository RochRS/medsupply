import { createFileRoute } from "@tanstack/react-router";

import "../css/index.css";
import { Footer } from "../components/footer";

export const Route = createFileRoute("/profiel")({
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
