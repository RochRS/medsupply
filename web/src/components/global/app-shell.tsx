import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  ShoppingBagAddIcon,
  PackageIcon,
  BarChartIcon,
  HistoryIcon,
  UserIcon,
  Settings01Icon,
  Logout01Icon,
  Menu01Icon,
  UserMultipleIcon,
  ClipboardListIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "@/lib/auth-client";
import { useCart } from "@/lib/cart";
import { roleLabel, useAppUser, type AppRole } from "@/lib/roles";
import { useAppSettings } from "@/lib/app-settings";
import { NotificationBell } from "@/components/global/notification-bell";
import logo from "@/assets/rkz-logo.png";

type NavIcon = typeof DashboardSquare01Icon;

type NavItem = {
  to: string;
  label: string;
  icon: NavIcon;
  roles?: AppRole[];
};

const mainLinks: NavItem[] = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: DashboardSquare01Icon,
    roles: ["admin", "apotheker"],
  },
  {
    to: "/dashboard",
    label: "Start",
    icon: DashboardSquare01Icon,
    roles: ["verpleging"],
  },
  {
    to: "/inventory",
    label: "Supplies",
    icon: PackageIcon,
    roles: ["verpleging"],
  },
  {
    to: "/request",
    label: "Mijn mand",
    icon: ShoppingBagAddIcon,
    roles: ["verpleging"],
  },
  {
    to: "/aanvragen",
    label: "Aanvragen",
    icon: ClipboardListIcon,
    roles: ["admin", "apotheker"],
  },
  {
    to: "/inventory",
    label: "Totale Voorraad",
    icon: PackageIcon,
    roles: ["admin", "apotheker"],
  },
  {
    to: "/statistics",
    label: "Statistieken",
    icon: BarChartIcon,
    roles: ["admin", "apotheker"],
  },
  {
    to: "/mijn-aanvragen",
    label: "Mijn aanvragen",
    icon: ClipboardListIcon,
    roles: ["verpleging"],
  },
  {
    to: "/history",
    label: "Geschiedenis",
    icon: HistoryIcon,
    roles: ["admin", "apotheker"],
  },
  {
    to: "/admin",
    label: "Gebruikers",
    icon: UserMultipleIcon,
    roles: ["admin"],
  },
];

const accountLinks: NavItem[] = [
  {
    to: "/profiel",
    label: "Profiel",
    icon: UserIcon,
  },
  {
    to: "/settings",
    label: "Instellingen",
    icon: Settings01Icon,
    roles: ["admin"],
  },
];

function filterByRole(links: NavItem[], role: string | null) {
  return links.filter((link) => {
    if (!link.roles) return true;
    if (!role) return true; // show until role loads; API still enforces
    return link.roles.includes(role as AppRole);
  });
}

function NavLink({
  to,
  label,
  icon,
  active,
  badge,
  onNavigate,
}: {
  to: string;
  label: string;
  icon: NavIcon;
  active: boolean;
  badge?: number;
  onNavigate?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className={cn(
        "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-sky-100 text-sky-950"
          : "text-slate-600 hover:bg-sky-50 hover:text-sky-900",
      )}
    >
      <HugeiconsIcon icon={icon} strokeWidth={2} className="size-5 shrink-0" />
      <span className="truncate">{label}</span>
      {badge && badge > 0 ? (
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-700 px-1.5 text-[11px] font-semibold text-white">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { productCount } = useCart();
  const { data: session } = useSession();
  const { user, role } = useAppUser();
  const { appName } = useAppSettings();

  const visibleMain = useMemo(
    () => filterByRole(mainLinks, role),
    [role],
  );
  const visibleAccount = useMemo(
    () => filterByRole(accountLinks, role),
    [role],
  );

  const homeTo = role === "verpleging" ? "/inventory" : "/dashboard";

  const handleLogout = async () => {
    await signOut();
    onNavigate?.();
    await navigate({ to: "/" });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-sky-100 px-4 py-5">
        <Link
          to={homeTo}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40"
        >
          <img
            src={logo}
            alt="St. Vincentius Ziekenhuis"
            className="h-10 w-auto object-contain"
          />
          <div className="min-w-0">
            <p className="truncate text-base font-bold tracking-tight text-sky-950">
              {appName}
            </p>
            <p className="truncate text-xs text-slate-500">
              {role === "verpleging" ? "Supplies aanvragen" : "Apotheek voorraad"}
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        <p className="mb-1 px-3 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
          Menu
        </p>
        {visibleMain.map((link) => (
          <NavLink
            key={`${link.to}-${link.label}`}
            to={link.to}
            label={link.label}
            icon={link.icon}
            active={pathname === link.to}
            badge={link.to === "/request" ? productCount : undefined}
            onNavigate={onNavigate}
          />
        ))}

        <p className="mt-5 mb-1 px-3 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
          Account
        </p>
        {visibleAccount.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            label={link.label}
            icon={link.icon}
            active={pathname === link.to}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="flex flex-col gap-3 border-t border-sky-100 px-3 py-4">
        {session?.user || user ? (
          <div className="truncate rounded-xl bg-sky-50 px-3 py-2.5">
            <p className="truncate text-sm font-medium text-sky-950">
              {user?.name || session?.user.name || "Gebruiker"}
            </p>
            <p className="truncate text-xs text-slate-500">
              {user?.email || session?.user.email}
            </p>
            <p className="mt-1 text-[11px] font-medium text-sky-700">
              {roleLabel(role)}
            </p>
          </div>
        ) : null}
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full justify-start gap-2 rounded-xl border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
          onClick={handleLogout}
        >
          <HugeiconsIcon
            icon={Logout01Icon}
            strokeWidth={2}
            className="size-4"
          />
          Uitloggen
        </Button>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { productCount } = useCart();
  const { role } = useAppUser();
  const { appName } = useAppSettings();
  const canRequest = role === "verpleging";
  const homeTo = role === "verpleging" ? "/inventory" : "/dashboard";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-sky-50/40">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-sky-200/80 bg-white md:flex md:flex-col">
        <SidebarNav />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-sky-950/40"
            aria-label="Menu sluiten"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(18rem,85vw)] flex-col bg-white shadow-xl">
            <SidebarNav onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-sky-200/80 bg-white/90 px-4 backdrop-blur-md md:hidden">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 w-9 rounded-xl border-sky-200 p-0"
            onClick={() => setOpen(true)}
            aria-label="Menu openen"
          >
            <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} className="size-5" />
          </Button>
          <Link to={homeTo} className="flex items-center gap-2">
            <img src={logo} alt="" className="h-8 w-auto object-contain" />
            <span className="font-bold tracking-tight text-sky-950">{appName}</span>
          </Link>
          {canRequest ? (
            <div className="ml-auto flex items-center gap-1">
              <NotificationBell align="right" />
              <Link
                to="/request"
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl text-sky-900 hover:bg-sky-50"
                aria-label="Aanvraagmand"
              >
                <HugeiconsIcon
                  icon={ShoppingBagAddIcon}
                  strokeWidth={2}
                  className="size-5"
                />
                {productCount > 0 ? (
                  <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-sky-700 px-1 text-[10px] font-semibold text-white">
                    {productCount}
                  </span>
                ) : null}
              </Link>
            </div>
          ) : null}
        </header>

        {canRequest ? (
          <header className="sticky top-0 z-40 hidden h-12 shrink-0 items-center justify-end gap-2 border-b border-sky-200/80 bg-white/90 px-6 backdrop-blur-md md:flex">
            <NotificationBell align="right" />
          </header>
        ) : null}

        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
