import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent, // 👈 Pass it by name here
});

// 👈 Define your component outside.
// Fast Refresh can now see exactly what it needs to watch!
function HomeComponent() {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold">Welcome Home!</h1>
    </div>
  );
}
