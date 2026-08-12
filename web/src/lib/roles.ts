import { useCallback, useEffect, useState } from "react";
import { apiClient } from "../config/api";

export type AppRole = "admin" | "apotheker" | "verpleging";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  roleId: number | null;
  roleName: AppRole | string | null;
  mustChangePassword?: boolean;
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

  const refresh = useCallback(async () => {
    try {
      const result = await apiClient("/sessions/me");
      setUser((result as { user: AppUser }).user);
      return (result as { user: AppUser }).user;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
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
    mustChangePassword: Boolean(user?.mustChangePassword),
    refresh,
    isAdmin: role === "admin",
    isApotheker: role === "apotheker" || role === "admin",
    isVerpleging: role === "verpleging",
  };
}
