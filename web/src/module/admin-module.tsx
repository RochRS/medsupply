import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { apiClient } from "../config/api";
import { LoadingSpinner } from "../components/global/loading-spinner";
import { roleLabel, useAppUser } from "../lib/roles";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

type RoleRow = {
  roleId: number;
  roleName: string;
};

type UserRow = {
  id: string;
  name: string;
  email: string;
  roleId: number | null;
  roleName: string | null;
  createdAt: string;
};

export function AdminUsersPage() {
  const { user: me } = useAppUser();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [usersRes, rolesRes] = await Promise.all([
        apiClient("/users") as Promise<{ users: UserRow[] }>,
        apiClient("/users/roles") as Promise<{ roles: RoleRow[] }>,
      ]);
      setUsers(usersRes.users);
      setRoles(rolesRes.roles);
    } catch {
      setError("Alleen admins kunnen gebruikers en rollen beheren.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleRoleChange = async (userId: string, roleId: string) => {
    setSavingId(userId);
    setError("");
    try {
      await apiClient(`/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({
          roleId: roleId ? Number(roleId) : null,
        }),
      });
      await load();
    } catch {
      setError("Rol bijwerken mislukt.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (target: UserRow) => {
    if (me?.id === target.id) {
      setError("Je kunt je eigen account niet verwijderen.");
      return;
    }

    const confirmed = window.confirm(
      `Weet je zeker dat je ${target.name} (${target.email}) wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`,
    );
    if (!confirmed) return;

    setDeletingId(target.id);
    setError("");
    try {
      await apiClient(`/users/${target.id}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((u) => u.id !== target.id));
    } catch {
      setError("Gebruiker verwijderen mislukt.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Gebruikers laden..." />;
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-rkz-navy dark:text-white">
          Gebruikers & rollen
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Admin: beheer accounts en rollen (admin, apotheker, verpleging)
        </p>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <div className="grid gap-3">
        {users.map((u) => {
          const isSelf = me?.id === u.id;
          const busy = savingId === u.id || deletingId === u.id;
          const roleItems = [
            { value: "", label: "Geen rol" },
            ...roles.map((r) => ({
              value: String(r.roleId),
              label: roleLabel(r.roleName),
            })),
          ];
          return (
            <div
              key={u.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="min-w-0">
                <p className="font-semibold text-rkz-navy dark:text-white">
                  {u.name}
                  {isSelf ? (
                    <span className="ml-2 text-xs font-normal text-slate-400">
                      (jij)
                    </span>
                  ) : null}
                </p>
                <p className="truncate text-sm text-slate-500">{u.email}</p>
                <p className="mt-1 text-xs text-slate-400">
                  Huidige rol: {roleLabel(u.roleName)}
                </p>
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                <div className="w-full sm:w-48">
                  <Select
                    items={roleItems}
                    value={u.roleId != null ? String(u.roleId) : ""}
                    onValueChange={(value) =>
                      void handleRoleChange(u.id, value ?? "")
                    }
                    disabled={busy}
                  >
                    <SelectTrigger className="w-full rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roleItems.map((opt) => (
                        <SelectItem key={opt.value || "none"} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  disabled={busy || isSelf}
                  title={
                    isSelf
                      ? "Je kunt je eigen account niet verwijderen"
                      : "Gebruiker verwijderen"
                  }
                  className="gap-1.5 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                  onClick={() => void handleDelete(u)}
                >
                  <HugeiconsIcon icon={Delete02Icon} size={16} />
                  {deletingId === u.id ? "Verwijderen..." : "Verwijderen"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
