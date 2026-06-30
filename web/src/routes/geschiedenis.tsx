import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/geschiedenis')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/geschiedenis"!</div>
}
