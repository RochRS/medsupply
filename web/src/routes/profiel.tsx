import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profiel')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/profiel"!</div>
}
