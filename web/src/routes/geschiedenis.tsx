import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "../components/footer";

import "../css/index.css";

export const Route = createFileRoute("/geschiedenis")({
  component: RouteComponent,
});
//#########################################################################
//Local Components
//#########################################################################

//#########################################################################
//Page
//#########################################################################

function RouteComponent() {
  return (
    <div>
      <div></div>
      <Footer />
    </div>
  );
}
