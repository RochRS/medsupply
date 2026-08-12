import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="min-h-full bg-rkz-bg dark:bg-slate-900">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-sky-950 dark:text-sky-50">
            Instellingen
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Coming soon
          </p>
        </header>
      </div>
    </div>
  );
}
