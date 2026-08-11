import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AppShell } from "../components/global/app-shell";

const RootLayout = () => {
  const location = useLocation();
  const isLogin = location.pathname === "/";

  if (isLogin) {
    return (
      <>
        <Outlet />
        <TanStackRouterDevtools />
      </>
    );
  }

  return (
    <>
      <AppShell>
        <Outlet />
      </AppShell>
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRoute({ component: RootLayout });
