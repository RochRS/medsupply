import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/totale-voorraad')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/totale-voorraad"!</div>
}
