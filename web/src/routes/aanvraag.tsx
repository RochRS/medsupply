import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/aanvraag')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/aanvraag"!</div>
}
