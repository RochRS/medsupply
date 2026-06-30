import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/statistieken')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/statistieken"!</div>
}
