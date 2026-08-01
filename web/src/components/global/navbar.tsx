import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./theme-toggle";
import { NotificationBell } from "./notification-bell";

export function Navbar() {
  return (
    <div className="bg-rkz-navy px-8 py-3 flex justify-between items-center">
      <div className="flex gap-6">
        <Link
          to="/dashboard"
          className="text-white/80 hover:text-white font-medium px-3 py-1.5 rounded-full transition-colors"
          activeProps={{ className: "!text-white bg-rkz-teal font-semibold px-3 py-1.5 rounded-full" }}
        >
          Dashboard
        </Link>
        <Link
          to="/request"
          className="text-white/80 hover:text-white font-medium px-3 py-1.5 rounded-full transition-colors"
          activeProps={{ className: "!text-white bg-rkz-teal font-semibold px-3 py-1.5 rounded-full" }}
        >
          Request
        </Link>
        <Link
          to="/inventory"
          className="text-white/80 hover:text-white font-medium px-3 py-1.5 rounded-full transition-colors"
          activeProps={{ className: "!text-white bg-rkz-teal font-semibold px-3 py-1.5 rounded-full" }}
        >
          Inventory
        </Link>
        <Link
          to="/statistics"
          className="text-white/80 hover:text-white font-medium px-3 py-1.5 rounded-full transition-colors"
          activeProps={{ className: "!text-white bg-rkz-teal font-semibold px-3 py-1.5 rounded-full" }}
        >
          Statistics
        </Link>
        <Link
          to="/history"
          className="text-white/80 hover:text-white font-medium px-3 py-1.5 rounded-full transition-colors"
          activeProps={{ className: "!text-white bg-rkz-teal font-semibold px-3 py-1.5 rounded-full" }}
        >
          History
        </Link>
      </div>
      <div className="flex gap-4 items-center">
        <NotificationBell />
        <ThemeToggle />
        <Link to="/profiel" className="text-white/80 hover:text-white font-medium">Profile</Link>
        <button className="text-white border border-white/40 rounded-full px-4 py-1.5 text-sm hover:bg-white/10 transition-colors">
          Log Out
        </button>
      </div>
    </div>
  );
}