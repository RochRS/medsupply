import { createFileRoute } from "@tanstack/react-router";
import { MyRequestsPage } from "../module/my-requests-module";

export const Route = createFileRoute("/mijn-aanvragen")({
  component: MyRequestsPage,
});
