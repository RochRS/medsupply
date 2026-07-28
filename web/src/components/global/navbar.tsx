import { Link } from "@tanstack/react-router";

export function Navbar() {
  return (
    <>
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex gap-10">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/aanvraag">Aanvraag</Link>
          <Link to="/totale-voorraad">Totale Voorraad</Link>
          <Link to="/statistieken">Statistieken</Link>
          <Link to="/geschiedenis">Geschiedenis</Link>
        </div>
        <div className="flex gap-10">
          <Link to="/profiel">Profiel</Link>
          <Link to="/settings">Settings</Link>
          <button>Log Out</button>
        </div>
      </div>
      <hr />
    </>
  );
}