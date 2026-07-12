import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "../components/global/footer.tsx";

import {
  ProfielInformation,
  ProfielPageButtons,
} from "../module/profiel-module.tsx";

import "../css/profiel.css";

export const Route = createFileRoute("/profiel")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div>
        <div className="text-center">
          <h1>Profiel</h1>
          <p>Hier kan je je profiel aanpassen.</p>
        </div>

        <div>
          {/* <image src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" className="avatar" /> */}
        </div>

        <div>
          <ProfielInformation />
        </div>

        <div>
          <ProfielPageButtons />
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}
