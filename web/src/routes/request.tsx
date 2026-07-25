import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "../components/global/footer.tsx";

import { RequestForm } from "../module/request-module.tsx";

import "../css/request.css";

export const Route = createFileRoute("/request")({   // ← was "/aanvraag"
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="min-h-screen bg-linear-to-b from-slate-100 to-teal-50">
        <div className="text-center py-3">
          <h1 className="text-2xl font-bold text-teal-800">Aanvraag</h1>
        </div>

        <div className="px-4 pb-8 flex justify-center">
          <RequestForm />
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}