import { Link } from "@tanstack/react-router";

export function Navbar() {
  return (
    <>
      <div className="flex justify-between items-center px-8 py-3 bg-white">
        <div className="flex gap-6">
          <Link
            to="/dashboard"
            className="text-slate-500 hover:text-teal-400 font-medium"
            activeProps={{ className: "text-teal-800 font-semibold" }}
          >
            Dashboard
          </Link>
          <Link
            to="/request"
            className="text-slate-500 hover:text-teal-400 font-medium"
            activeProps={{ className: "text-teal-800 font-semibold" }}
          >
            Request
          </Link>
          <Link
            to="/total-inventory"
            className="text-slate-500 hover:text-teal-400 font-medium"
            activeProps={{ className: "text-teal-800 font-semibold" }}
          >
            Total Inventory
          </Link>
          <Link
            to="/statistics"
            className="text-slate-500 hover:text-teal-400 font-medium"
            activeProps={{ className: "text-teal-800 font-semibold" }}
          >
            Statistics
          </Link>
          <Link
            to="/history"
            className="text-slate-500 hover:text-teal-400 font-medium"
            activeProps={{ className: "text-teal-800 font-semibold" }}
          >
            History
          </Link>
        </div>
        <div className="flex gap-6 items-center">
          <Link to="/profiel" className="text-slate-500 hover:text-teal-400 font-medium">
            Profile
          </Link>
          <Link to="/settings" className="text-slate-500 hover:text-teal-400 font-medium">
            Settings
          </Link>
          <button className="text-rose-600 font-medium hover:text-rose-700">Log Out</button>
        </div>
      </div>
      <hr className="border-t-2 border-teal-100" />
    </>
  );
}