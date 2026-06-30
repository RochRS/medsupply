import {
  createRootRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

//styiling
import "../css/index.css";

const RootLayout = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/";

  return (
    <>
      {!hideNavbar && (
        <>
          <div className="flex justify-between items-center px-6 py-4">
            <div className="flex gap-10">
              <Link to="/dashboard">Dashboard</Link>{" "}
              <Link to="/aanvraag">Aanvraag</Link>{" "}
              <Link to="/totale-voorraad">Totale Voorraad</Link>{" "}
              <Link to="/statistieken">Statistieken</Link>{" "}
              <Link to="/geschiedenis">Geschiedenis</Link>{" "}
            </div>
            <div className="flex gap-10">
              <Link to="/profiel">Profiel</Link>{" "}
              <Link to="/settings">Settings</Link>
            </div>
          </div>
          <hr />
        </>
      )}
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRoute({ component: RootLayout });
