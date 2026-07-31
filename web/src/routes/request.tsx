import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "../components/global/footer.tsx";
import { RequestForm } from "../module/request-module.tsx";

import "../css/request.css";

export const Route = createFileRoute("/request")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="min-h-screen bg-rkz-bg dark:bg-slate-900">
        <div className="text-center py-3">
          <h1 className="text-2xl font-bold text-rkz-navy dark:text-white">Aanvraag</h1>
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