import { and, eq, ne } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { hashPassword, verifyPassword } from "better-auth/crypto";
import { auth } from "../auth/auth.js";
import { db } from "../database/database.js";
import { account, user, role, request } from "../database/schemas/schema.js";
import type { RoleName } from "../database/seed/seed-roles.js";
import type { UpdateOwnProfileInput } from "../schemas/user-login.js";

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
  mustChangePassword: boolean;
  createdAt: Date;
};

export type CreatedUserAdmin = UserWithRole & {
  temporaryPassword: string;
};

/** Readable temporary password for demos / first login (12 chars). */
export function generateTemporaryPassword(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = randomBytes(12);
  let out = "";
  for (let i = 0; i < 12; i++) {
    out += alphabet[bytes[i]! % alphabet.length];
  }
  return out;
}

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

export async function getMustChangePassword(userId: string): Promise<boolean> {
  const [row] = await db
    .select({ mustChangePassword: user.mustChangePassword })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
  return row?.mustChangePassword ?? false;
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
      mustChangePassword: user.mustChangePassword,
      createdAt: user.createdAt,
    })
    .from(user)
    .leftJoin(role, eq(user.roleId, role.roleId))
    .orderBy(user.name);

  return rows.map((r) => ({
    ...r,
    roleName: r.roleName ?? null,
    mustChangePassword: r.mustChangePassword ?? false,
  }));
}

async function getUserWithRoleById(userId: string): Promise<UserWithRole | null> {
  const [row] = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      roleName: role.roleName,
      mustChangePassword: user.mustChangePassword,
      createdAt: user.createdAt,
    })
    .from(user)
    .leftJoin(role, eq(user.roleId, role.roleId))
    .where(eq(user.id, userId))
    .limit(1);

  if (!row) return null;
  return {
    ...row,
    roleName: row.roleName ?? null,
    mustChangePassword: row.mustChangePassword ?? false,
  };
}

export class UserAdminError extends Error {
  constructor(
    readonly code: "EMAIL_EXISTS" | "CREATE_FAILED" | "INVALID_PASSWORD",
    message: string,
  ) {
    super(message);
    this.name = "UserAdminError";
  }
}

/**
 * Update the authenticated user's editable profile fields only.
 * Administrative fields must never be added to this input type.
 */
export async function updateOwnProfile(
  userId: string,
  input: UpdateOwnProfileInput,
): Promise<UserWithRole | null> {
  await db.transaction(async (tx) => {
    const [existing] = await tx
      .select({ id: user.id, email: user.email })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!existing) return;

    const userUpdates: { name?: string; email?: string } = {};
    if (input.name !== undefined) userUpdates.name = input.name;

    if (input.email !== undefined && input.email !== existing.email) {
      const [duplicate] = await tx
        .select({ id: user.id })
        .from(user)
        .where(and(eq(user.email, input.email), ne(user.id, userId)))
        .limit(1);

      if (duplicate) {
        throw new UserAdminError("EMAIL_EXISTS", "Email is already in use");
      }

      userUpdates.email = input.email;
      await tx
        .update(account)
        .set({ accountId: input.email })
        .where(eq(account.userId, userId));
    }

    if (Object.keys(userUpdates).length > 0) {
      await tx.update(user).set(userUpdates).where(eq(user.id, userId));
    }
  });

  return getUserWithRoleById(userId);
}

export async function createUserAdmin(input: {
  name: string;
  email: string;
  password?: string;
  roleId?: number | null;
}): Promise<CreatedUserAdmin> {
  const email = input.email.toLowerCase();
  const temporaryPassword = input.password ?? generateTemporaryPassword();

  const [existing] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (existing) {
    throw new UserAdminError("EMAIL_EXISTS", "Email is already in use");
  }

  await auth.api.signUpEmail({
    body: {
      name: input.name,
      email,
      password: temporaryPassword,
    },
  });

  const [created] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (!created) {
    throw new UserAdminError("CREATE_FAILED", "Could not create user");
  }

  await db
    .update(user)
    .set({
      roleId: input.roleId ?? null,
      name: input.name,
      mustChangePassword: true,
    })
    .where(eq(user.id, created.id));

  const row = await getUserWithRoleById(created.id);
  if (!row) {
    throw new UserAdminError("CREATE_FAILED", "Could not load created user");
  }
  return { ...row, temporaryPassword };
}

export async function updateUserAdmin(
  userId: string,
  input: {
    name?: string;
    email?: string;
    password?: string;
    regeneratePassword?: boolean;
    roleId?: number | null;
  },
): Promise<(UserWithRole & { temporaryPassword?: string }) | null> {
  const [existing] = await db
    .select({ id: user.id, email: user.email })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (!existing) return null;

  const userUpdates: {
    name?: string;
    email?: string;
    roleId?: number | null;
    mustChangePassword?: boolean;
  } = {};

  if (input.name !== undefined) userUpdates.name = input.name;
  if (input.roleId !== undefined) userUpdates.roleId = input.roleId;

  if (input.email !== undefined) {
    const email = input.email.toLowerCase();
    if (email !== existing.email) {
      const [duplicate] = await db
        .select({ id: user.id })
        .from(user)
        .where(and(eq(user.email, email), ne(user.id, userId)))
        .limit(1);

      if (duplicate) {
        throw new UserAdminError("EMAIL_EXISTS", "Email is already in use");
      }

      userUpdates.email = email;
      await db
        .update(account)
        .set({ accountId: email })
        .where(eq(account.userId, userId));
    }
  }

  let temporaryPassword: string | undefined;
  if (input.regeneratePassword) {
    temporaryPassword = generateTemporaryPassword();
    const hashed = await hashPassword(temporaryPassword);
    await db
      .update(account)
      .set({ password: hashed })
      .where(eq(account.userId, userId));
    userUpdates.mustChangePassword = true;
  } else if (input.password) {
    const hashed = await hashPassword(input.password);
    await db
      .update(account)
      .set({ password: hashed })
      .where(eq(account.userId, userId));
    userUpdates.mustChangePassword = true;
  }

  if (Object.keys(userUpdates).length > 0) {
    await db.update(user).set(userUpdates).where(eq(user.id, userId));
  }

  const row = await getUserWithRoleById(userId);
  if (!row) return null;
  return temporaryPassword ? { ...row, temporaryPassword } : row;
}

/**
 * Authenticated user changes their own password (first login / settings).
 */
export async function changeOwnPassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const [acc] = await db
    .select({ password: account.password })
    .from(account)
    .where(eq(account.userId, userId))
    .limit(1);

  if (!acc?.password) {
    throw new UserAdminError(
      "INVALID_PASSWORD",
      "No password set for this account",
    );
  }

  const valid = await verifyPassword({
    hash: acc.password,
    password: currentPassword,
  });
  if (!valid) {
    throw new UserAdminError(
      "INVALID_PASSWORD",
      "Current password is incorrect",
    );
  }

  const hashed = await hashPassword(newPassword);
  await db
    .update(account)
    .set({ password: hashed })
    .where(eq(account.userId, userId));
  await db
    .update(user)
    .set({ mustChangePassword: false })
    .where(eq(user.id, userId));
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

  await db
    .update(request)
    .set({ userId: null })
    .where(eq(request.userId, userId));
  await db.delete(user).where(eq(user.id, userId));
  return true;
}
