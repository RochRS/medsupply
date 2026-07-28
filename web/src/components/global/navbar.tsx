import { Link } from "@tanstack/react-router";

export function Navbar() {
  return (
    <>
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex gap-10">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/aanvraag">Request</Link>
          <Link to="/totale-voorraad">Total Inventory</Link>
          <Link to="/statistieken">Statistics</Link>
          <Link to="/geschiedenis">History</Link>
        </div>
        <div className="flex gap-10">
          <Link to="/profiel">Profile</Link>
          <Link to="/settings">Settings</Link>
          <button>Log Out</button>
        </div>
      </div>
      <hr />
    </>
  );
}