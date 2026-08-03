import { db } from "../database/database.js";
import { user, role, department } from "../database/schemas/schema.js";
import { eq, asc } from "drizzle-orm";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  roleId: number | null;
  roleName: string | null;
  departmentId: number | null;
  departmentName: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type UpdateUserProfileInput = {
  name?: string;
  email?: string;
  departmentId?: number | null;
};

// Resolve the user id to use: the logged-in user, or the first seeded
// user when auth is disabled in development (demo mode).
export async function resolveUserId(userId?: string | null): Promise<string | null> {
  if (userId) return userId;

  const [first] = await db
    .select({ id: user.id })
    .from(user)
    .orderBy(asc(user.createdAt))
    .limit(1);

  return first?.id ?? null;
}

export async function getUserProfile(userId: string) {
  const [row] = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      roleId: user.roleId,
      roleName: role.roleName,
      departmentId: user.departmentId,
      departmentName: department.departmentName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
    .from(user)
    .leftJoin(role, eq(user.roleId, role.roleId))
    .leftJoin(department, eq(user.departmentId, department.departmentId))
    .where(eq(user.id, userId))
    .limit(1);

  return row ?? null;
}

export async function updateUserProfile(userId: string, data: UpdateUserProfileInput) {
  const [updated] = await db
    .update(user)
    .set(data)
    .where(eq(user.id, userId))
    .returning({
      id: user.id,
      name: user.name,
      email: user.email,
      departmentId: user.departmentId,
      updatedAt: user.updatedAt,
    });

  return updated ?? null;
}
