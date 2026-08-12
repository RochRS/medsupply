import { createFileRoute } from "@tanstack/react-router";
import { RequestForm } from "../module/request-module.tsx";
import { useAppUser } from "../lib/roles";
import { LoadingSpinner } from "../components/global/loading-spinner";

export const Route = createFileRoute("/request")({
  component: RouteComponent,
});

function RouteComponent() {
  const { role, loading } = useAppUser();

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner label="Laden..." />
      </div>
    );
  }

  if (role !== "verpleging") {
    return (
      <div className="mx-auto max-w-lg p-6">
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          Alleen verpleging kan een aanvraag plaatsen. Admin en apotheker
          verwerken inkomende aanvragen onder{" "}
          <span className="font-semibold">Aanvragen</span>.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-rkz-bg dark:bg-slate-900">
      <div className="flex justify-center px-4 pt-6 pb-8">
        <RequestForm />
      </div>
    </div>
  );
}
