import { useEffect } from "react";
import { createRootRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AppShell } from "../components/global/app-shell";
import { useAppUser } from "../lib/roles";
import { useDocumentSeo } from "../lib/use-document-seo";

const RootLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mustChangePassword, loading } = useAppUser();
  const isLogin = location.pathname === "/";
  const isChangePassword = location.pathname === "/change-password";

  useDocumentSeo(location.pathname);

  useEffect(() => {
    if (loading || isLogin) return;
    if (mustChangePassword && !isChangePassword) {
      void navigate({ to: "/change-password" });
    }
  }, [loading, mustChangePassword, isChangePassword, isLogin, navigate]);

  if (isLogin || isChangePassword) {
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
