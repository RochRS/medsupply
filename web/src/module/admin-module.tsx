import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Delete02Icon,
  Edit02Icon,
  Key01Icon,
} from "@hugeicons/core-free-icons";
import { apiClient } from "../config/api";
import { LoadingSpinner } from "../components/global/loading-spinner";
import { FormInput } from "../components/global/form-input";
import { DemoFillButton } from "../components/global/demo-fill-button";
import { demoUser } from "../lib/demo-form-data";
import { roleLabel, useAppUser } from "../lib/roles";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
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
  mustChangePassword?: boolean;
  createdAt: string;
};

type UserFormState = {
  name: string;
  email: string;
  roleId: string;
};

const emptyForm: UserFormState = {
  name: "",
  email: "",
  roleId: "",
};

function roleSelectItems(roles: RoleRow[]) {
  return [
    { value: "", label: "Geen rol" },
    ...roles.map((r) => ({
      value: String(r.roleId),
      label: roleLabel(r.roleName),
    })),
  ];
}

function TempPasswordDialog({
  open,
  onOpenChange,
  email,
  temporaryPassword,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  temporaryPassword: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(temporaryPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-md">
        <DialogHeader className="border-b border-slate-100 px-5 py-4 dark:border-slate-700">
          <DialogTitle className="text-base font-bold text-rkz-navy dark:text-white">
            Tijdelijk wachtwoord
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 px-5 py-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Geef dit wachtwoord door aan{" "}
            <span className="font-medium text-rkz-navy dark:text-white">
              {email}
            </span>
            . Bij de eerste login moet de gebruiker een nieuw wachtwoord kiezen.
          </p>
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 dark:border-amber-800 dark:bg-amber-950/30">
            <code className="flex-1 select-all font-mono text-base font-semibold tracking-wide text-amber-950 dark:text-amber-100">
              {temporaryPassword}
            </code>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 rounded-lg"
              onClick={() => void copy()}
            >
              {copied ? "Gekopieerd" : "Kopieer"}
            </Button>
          </div>
        </div>
        <DialogFooter className="border-t border-slate-100 bg-slate-50/80 px-5 py-4 dark:border-slate-700 dark:bg-slate-900/40">
          <Button
            type="button"
            className="rounded-xl bg-sky-700 text-white hover:bg-sky-800"
            onClick={() => onOpenChange(false)}
          >
            Begrepen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UserFormDialog({
  open,
  onOpenChange,
  title,
  form,
  onFormChange,
  errors,
  submitLabel,
  saving,
  onSubmit,
  roles,
  showDemoFill,
  footerNote,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  form: UserFormState;
  onFormChange: (patch: Partial<UserFormState>) => void;
  errors: Partial<Record<keyof UserFormState, string>>;
  submitLabel: string;
  saving: boolean;
  onSubmit: () => void;
  roles: RoleRow[];
  showDemoFill?: boolean;
  footerNote?: string;
}) {
  const roleItems = roleSelectItems(roles);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-md">
        <DialogHeader className="border-b border-slate-100 px-5 py-4 dark:border-slate-700">
          <div className="flex flex-wrap items-start justify-between gap-2 pr-8">
            <DialogTitle className="text-base font-bold text-rkz-navy dark:text-white">
              {title}
            </DialogTitle>
            {showDemoFill ? (
              <DemoFillButton
                disabled={saving}
                onClick={() => {
                  const demo = demoUser(roles);
                  onFormChange({
                    name: demo.name,
                    email: demo.email,
                    roleId: demo.roleId,
                  });
                }}
              />
            ) : null}
          </div>
        </DialogHeader>

        <div className="px-5 py-4">
          <div className="flex flex-col gap-4">
            <FormInput
              label="Naam"
              name="name"
              value={form.name}
              onChange={(v) => onFormChange({ name: v })}
              placeholder="Bijv. Jan Jansen"
              required
              error={errors.name}
            />
            <FormInput
              label="E-mail"
              name="email"
              type="email"
              value={form.email}
              onChange={(v) => onFormChange({ email: v })}
              placeholder="naam@rkz.sr"
              required
              error={errors.email}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-sky-950 dark:text-slate-200">
                Rol
              </label>
              <Select
                items={roleItems}
                value={form.roleId}
                onValueChange={(v) => onFormChange({ roleId: v ?? "" })}
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
            {footerNote ? (
              <p className="rounded-xl border border-sky-100 bg-sky-50/80 px-3 py-2 text-xs text-sky-900 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-100">
                {footerNote}
              </p>
            ) : null}
          </div>
        </div>

        <DialogFooter className="border-t border-slate-100 bg-slate-50/80 px-5 py-4 sm:justify-end dark:border-slate-700 dark:bg-slate-900/40">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Annuleren
          </Button>
          <Button
            type="button"
            onClick={() => void onSubmit()}
            disabled={saving}
            className="rounded-xl bg-sky-700 text-white hover:bg-sky-800"
          >
            {saving ? "Bezig..." : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AdminUsersPage() {
  const { user: me } = useAppUser();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<UserFormState>(emptyForm);
  const [createErrors, setCreateErrors] = useState<
    Partial<Record<keyof UserFormState, string>>
  >({});
  const [creating, setCreating] = useState(false);

  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [editForm, setEditForm] = useState<UserFormState>(emptyForm);
  const [editErrors, setEditErrors] = useState<
    Partial<Record<keyof UserFormState, string>>
  >({});
  const [editing, setEditing] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);

  const [tempPassword, setTempPassword] = useState<{
    email: string;
    password: string;
  } | null>(null);

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
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("Unauthorized") || msg.includes("AUTHENTICATION")) {
        setError("Niet ingelogd of sessie verlopen. Log opnieuw in.");
      } else if (msg.includes("Forbidden") || msg.includes("INSUFFICIENT")) {
        setError(
          "Geen admin-rol. Open Gebruikers niet, of wijs admin toe na seed (zie demo-accounts).",
        );
      } else {
        setError(
          msg
            ? `Laden mislukt: ${msg}`
            : "Gebruikers laden mislukt. Controleer API-URL en of de database geseeded is.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const validateForm = (form: UserFormState) => {
    const next: Partial<Record<keyof UserFormState, string>> = {};
    if (form.name.trim().length < 2) {
      next.name = "Naam moet minimaal 2 tekens zijn";
    }
    if (!form.email.trim()) {
      next.email = "E-mail is verplicht";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Ongeldig e-mailadres";
    }
    return next;
  };

  const handleCreate = async () => {
    const next = validateForm(createForm);
    setCreateErrors(next);
    if (Object.keys(next).length > 0) return;

    setCreating(true);
    setError("");
    try {
      const res = (await apiClient("/users", {
        method: "POST",
        body: JSON.stringify({
          name: createForm.name.trim(),
          email: createForm.email.trim(),
          roleId: createForm.roleId ? Number(createForm.roleId) : null,
        }),
      })) as { temporaryPassword?: string; user?: { email: string } };

      setCreateOpen(false);
      setCreateForm(emptyForm);
      setCreateErrors({});
      if (res.temporaryPassword) {
        setTempPassword({
          email: res.user?.email ?? createForm.email.trim(),
          password: res.temporaryPassword,
        });
      }
      await load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("EMAIL_EXISTS") || msg.includes("in gebruik")) {
        setCreateErrors({ email: "Dit e-mailadres is al in gebruik" });
      } else {
        setError(msg || "Gebruiker aanmaken mislukt.");
      }
    } finally {
      setCreating(false);
    }
  };

  const openEdit = (target: UserRow) => {
    setEditUser(target);
    setEditForm({
      name: target.name,
      email: target.email,
      roleId: target.roleId != null ? String(target.roleId) : "",
    });
    setEditErrors({});
  };

  const handleEdit = async () => {
    if (!editUser) return;
    const next = validateForm(editForm);
    setEditErrors(next);
    if (Object.keys(next).length > 0) return;

    setEditing(true);
    setError("");
    try {
      await apiClient(`/users/${editUser.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: editForm.name.trim(),
          email: editForm.email.trim(),
          roleId: editForm.roleId ? Number(editForm.roleId) : null,
        }),
      });
      setEditUser(null);
      setEditForm(emptyForm);
      await load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("EMAIL_EXISTS") || msg.includes("in gebruik")) {
        setEditErrors({ email: "Dit e-mailadres is al in gebruik" });
      } else {
        setError(msg || "Gebruiker bijwerken mislukt.");
      }
    } finally {
      setEditing(false);
    }
  };

  const handleRegeneratePassword = async (target: UserRow) => {
    const confirmed = window.confirm(
      `Nieuw tijdelijk wachtwoord genereren voor ${target.name}? De gebruiker moet dit bij de volgende login wijzigen.`,
    );
    if (!confirmed) return;

    setRegeneratingId(target.id);
    setError("");
    try {
      const res = (await apiClient(`/users/${target.id}`, {
        method: "PATCH",
        body: JSON.stringify({ regeneratePassword: true }),
      })) as { temporaryPassword?: string };

      if (res.temporaryPassword) {
        setTempPassword({
          email: target.email,
          password: res.temporaryPassword,
        });
      }
      await load();
    } catch {
      setError("Tijdelijk wachtwoord genereren mislukt.");
    } finally {
      setRegeneratingId(null);
    }
  };

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

  const roleItems = roleSelectItems(roles);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-rkz-navy dark:text-white">
            Gebruikers & rollen
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Admin: accounts aanmaken, bewerken en rollen toewijzen
          </p>
        </div>
        <Button
          type="button"
          className="h-11 w-full gap-2 rounded-xl bg-sky-700 px-5 text-sm font-semibold text-white shadow-sm hover:bg-sky-800 sm:w-auto sm:min-w-[12rem]"
          onClick={() => {
            setCreateForm(emptyForm);
            setCreateErrors({});
            setCreateOpen(true);
          }}
        >
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-4" />
          Gebruiker toevoegen
        </Button>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <div className="grid gap-3">
        {users.map((u) => {
          const isSelf = me?.id === u.id;
          const busy =
            savingId === u.id ||
            deletingId === u.id ||
            regeneratingId === u.id;
          return (
            <div
              key={u.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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
                  {u.mustChangePassword ? (
                    <span className="mt-2 inline-flex rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-800 uppercase">
                      Tijdelijk wachtwoord
                    </span>
                  ) : null}
                </div>

                <div className="w-full sm:w-52">
                  <label className="mb-1.5 block text-[11px] font-medium tracking-wide text-slate-400 uppercase">
                    Rol
                  </label>
                  <Select
                    items={roleItems}
                    value={u.roleId != null ? String(u.roleId) : ""}
                    onValueChange={(value) =>
                      void handleRoleChange(u.id, value ?? "")
                    }
                    disabled={busy}
                  >
                    <SelectTrigger className="h-10 w-full rounded-xl">
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
              </div>

              <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3 dark:border-slate-700">
                <Button
                  type="button"
                  variant="outline"
                  disabled={busy}
                  className="h-10 flex-1 gap-1.5 rounded-xl sm:flex-none sm:min-w-[7.5rem]"
                  onClick={() => openEdit(u)}
                >
                  <HugeiconsIcon icon={Edit02Icon} size={16} />
                  Bewerken
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={busy}
                  className="h-10 flex-1 gap-1.5 rounded-xl sm:flex-none sm:min-w-[7.5rem]"
                  title="Nieuw tijdelijk wachtwoord genereren"
                  onClick={() => void handleRegeneratePassword(u)}
                >
                  <HugeiconsIcon icon={Key01Icon} size={16} />
                  {regeneratingId === u.id ? "Bezig..." : "Reset"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={busy || isSelf}
                  title={
                    isSelf
                      ? "Je kunt je eigen account niet verwijderen"
                      : "Gebruiker verwijderen"
                  }
                  className="h-10 flex-1 gap-1.5 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50 sm:flex-none sm:min-w-[7.5rem]"
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

      <UserFormDialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) {
            setCreateForm(emptyForm);
            setCreateErrors({});
          }
        }}
        title="Nieuwe gebruiker"
        form={createForm}
        onFormChange={(patch) => {
          setCreateForm((prev) => ({ ...prev, ...patch }));
          setCreateErrors({});
        }}
        errors={createErrors}
        submitLabel="Aanmaken"
        saving={creating}
        onSubmit={handleCreate}
        roles={roles}
        showDemoFill
        footerNote="Er wordt automatisch een tijdelijk wachtwoord gegenereerd. De gebruiker moet dit bij de eerste login wijzigen."
      />

      <UserFormDialog
        open={editUser != null}
        onOpenChange={(open) => {
          if (!open) {
            setEditUser(null);
            setEditForm(emptyForm);
            setEditErrors({});
          }
        }}
        title={editUser ? `${editUser.name} bewerken` : "Gebruiker bewerken"}
        form={editForm}
        onFormChange={(patch) => {
          setEditForm((prev) => ({ ...prev, ...patch }));
          setEditErrors({});
        }}
        errors={editErrors}
        submitLabel="Opslaan"
        saving={editing}
        onSubmit={handleEdit}
        roles={roles}
        footerNote='Wachtwoord resetten? Gebruik de knop "Reset" op de gebruikerskaart.'
      />

      <TempPasswordDialog
        open={tempPassword != null}
        onOpenChange={(open) => {
          if (!open) setTempPassword(null);
        }}
        email={tempPassword?.email ?? ""}
        temporaryPassword={tempPassword?.password ?? ""}
      />
    </div>
  );
}
