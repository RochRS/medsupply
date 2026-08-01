import { useEffect, useState } from "react";
import { apiClient } from "../config/api";
import { Button } from "../components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { LoadingSpinner } from "../components/global/loading-spinner";

type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  createdAt: string;
};

type SessionResponse = {
  user: SessionUser;
};

export function ProfielInformation() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient("/sessions/me")
      .then((result) => {
        setUser((result as SessionResponse).user);
      })
      .catch(() => setError("Profielgegevens konden niet worden geladen."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSpinner label="Profiel laden..." />;
  }

  if (error || !user) {
    return <p className="text-sm text-red-500">{error || "Geen gebruiker gevonden."}</p>;
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString("nl-NL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-6 flex flex-col gap-3 max-w-md mx-auto">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-500">Naam</span>
        <span className="font-medium text-rkz-navy dark:text-white">{user.name}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-500">E-mailadres</span>
        <span className="font-medium text-rkz-navy dark:text-white">{user.email}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-500">Lid sinds</span>
        <span className="font-medium text-rkz-navy dark:text-white">{memberSince}</span>
      </div>
    </div>
  );
}

export function ProfielPageButtons() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center">
      <Button onClick={() => navigate({ to: "/dashboard" })} className="bg-rkz-teal hover:bg-rkz-teal/90">
        Terug naar Dashboard
      </Button>
    </div>
  );
}