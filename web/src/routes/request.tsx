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

        <div className="px-4 pt-6 pb-8 flex justify-center">
          <RequestForm />
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}