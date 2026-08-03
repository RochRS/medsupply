import { createFileRoute } from "@tanstack/react-router";
import { RequestForm } from "../module/request-module.tsx";

export const Route = createFileRoute("/request")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-full bg-rkz-bg dark:bg-slate-900">
      <div className="flex justify-center px-4 pt-6 pb-8">
        <RequestForm />
      </div>
    </div>
  );
}
