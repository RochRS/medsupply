import { useEffect, useState } from "react";
import { apiClient } from "../config/api";

export type AppRole = "admin" | "apotheker" | "verpleging";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  roleId: number | null;
  roleName: AppRole | string | null;
};

export function roleLabel(role: string | null | undefined) {
  switch (role) {
    case "admin":
      return "Admin";
    case "apotheker":
      return "Apotheker";
    case "verpleging":
      return "Verpleging";
    default:
      return "Geen rol";
  }
}

export function useAppUser() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    apiClient("/sessions/me")
      .then((result) => {
        if (!cancelled) {
          setUser((result as { user: AppUser }).user);
        }
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const role = user?.roleName ?? null;
  return {
    user,
    loading,
    role,
    isAdmin: role === "admin",
    isApotheker: role === "apotheker" || role === "admin",
    isVerpleging: role === "verpleging" || role === "admin",
  };
}
