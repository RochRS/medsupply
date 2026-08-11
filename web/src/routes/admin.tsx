import { createFileRoute } from "@tanstack/react-router";
import { AdminUsersPage } from "../module/admin-module.tsx";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-full bg-rkz-bg dark:bg-slate-900">
      <AdminUsersPage />
    </div>
  );
}
