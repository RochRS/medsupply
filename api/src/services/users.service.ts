import { eq } from "drizzle-orm";
import { db } from "../database/database.js";
import { user, role, request } from "../database/schemas/schema.js";
import type { RoleName } from "../database/seed/seed-roles.js";

export type UserRole = {
  roleId: number;
  roleName: RoleName | string;
};

export type UserWithRole = {
  id: string;
  name: string;
  email: string;
  roleId: number | null;
  roleName: string | null;
  createdAt: Date;
};

export async function getUserRole(userId: string): Promise<UserRole | null> {
  const [row] = await db
    .select({
      roleId: role.roleId,
      roleName: role.roleName,
    })
    .from(user)
    .leftJoin(role, eq(user.roleId, role.roleId))
    .where(eq(user.id, userId))
    .limit(1);

  if (!row?.roleId || !row.roleName) return null;
  return { roleId: row.roleId, roleName: row.roleName };
}

export async function listRoles() {
  return db.select().from(role).orderBy(role.roleName);
}

export async function listUsersWithRoles(): Promise<UserWithRole[]> {
  const rows = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      roleName: role.roleName,
      createdAt: user.createdAt,
    })
    .from(user)
    .leftJoin(role, eq(user.roleId, role.roleId))
    .orderBy(user.name);

  return rows.map((r) => ({
    ...r,
    roleName: r.roleName ?? null,
  }));
}

export async function assignUserRole(userId: string, roleId: number | null) {
  const [updated] = await db
    .update(user)
    .set({ roleId })
    .where(eq(user.id, userId))
    .returning({
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
    });

  if (!updated) return null;

  const roleInfo = updated.roleId
    ? await db
        .select({ roleName: role.roleName })
        .from(role)
        .where(eq(role.roleId, updated.roleId))
        .limit(1)
    : [];

  return {
    ...updated,
    roleName: roleInfo[0]?.roleName ?? null,
  };
}

/**
 * Permanently delete a user (sessions/accounts cascade; requests.user_id cleared).
 */
export async function deleteUserById(userId: string): Promise<boolean> {
  const [existing] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (!existing) return false;

  // request.user_id has no ON DELETE cascade — detach first
  await db
    .update(request)
    .set({ userId: null })
    .where(eq(request.userId, userId));
  await db.delete(user).where(eq(user.id, userId));
  return true;
}
