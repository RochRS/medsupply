import { Hono } from "hono";
import type { AppEnv } from "../types/hono.js";
import { ERROR_CODE_MAP } from "../constants/http-status-codes.js";
import { requireRole } from "../middleware/auth.js";
import { ROLE_NAMES } from "../database/seed/seed-roles.js";
import {
  assignUserRole,
  deleteUserById,
  listRoles,
  listUsersWithRoles,
} from "../services/users.service.js";

export const users = new Hono<AppEnv>();

// Current user profile (any authenticated via mountProtected)
users.get("/me", async (c) => {
  const currentUser = c.get("user");
  const role = c.get("role");
  if (!currentUser) {
    return c.json({ message: "Not authenticated" }, ERROR_CODE_MAP.UNAUTHORIZED);
  }
  return c.json({
    user: {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      roleId: role?.roleId ?? null,
      roleName: role?.roleName ?? null,
    },
  });
});

// Admin: list all users
users.get("/", requireRole(ROLE_NAMES.ADMIN), async (c) => {
  try {
    const rows = await listUsersWithRoles();
    return c.json({ users: rows });
  } catch (error) {
    console.error("users GET / error:", error);
    return c.json(
      { message: "Could not load users", error: "USERS_FETCH_FAILED" },
      ERROR_CODE_MAP.INTERNAL_SERVER_ERROR,
    );
  }
});

// Admin: list roles
users.get("/roles", requireRole(ROLE_NAMES.ADMIN), async (c) => {
  try {
    const rows = await listRoles();
    return c.json({ roles: rows });
  } catch (error) {
    console.error("users GET /roles error:", error);
    return c.json(
      { message: "Could not load roles", error: "ROLES_FETCH_FAILED" },
      ERROR_CODE_MAP.INTERNAL_SERVER_ERROR,
    );
  }
});

// Admin: assign role to user
users.patch("/:id/role", requireRole(ROLE_NAMES.ADMIN), async (c) => {
  const userId = c.req.param("id");
  const body = await c.req.json<{ roleId: number | null }>();

  if (body.roleId !== null && (!Number.isInteger(body.roleId) || body.roleId < 1)) {
    return c.json(
      { message: "Invalid roleId", error: "VALIDATION_ERROR" },
      ERROR_CODE_MAP.BAD_REQUEST,
    );
  }

  try {
    const updated = await assignUserRole(userId, body.roleId);
    if (!updated) {
      return c.json(
        { message: "User not found", error: "NOT_FOUND" },
        ERROR_CODE_MAP.NOT_FOUND,
      );
    }
    return c.json({ user: updated });
  } catch (error) {
    console.error("users PATCH /:id/role error:", error);
    return c.json(
      { message: "Could not update role", error: "ROLE_UPDATE_FAILED" },
      ERROR_CODE_MAP.INTERNAL_SERVER_ERROR,
    );
  }
});

// Admin: delete user (cannot delete yourself)
users.delete("/:id", requireRole(ROLE_NAMES.ADMIN), async (c) => {
  const userId = c.req.param("id");
  const currentUser = c.get("user");

  if (currentUser?.id === userId) {
    return c.json(
      {
        message: "Je kunt je eigen account niet verwijderen",
        error: "CANNOT_DELETE_SELF",
      },
      ERROR_CODE_MAP.BAD_REQUEST,
    );
  }

  try {
    const deleted = await deleteUserById(userId);
    if (!deleted) {
      return c.json(
        { message: "User not found", error: "NOT_FOUND" },
        ERROR_CODE_MAP.NOT_FOUND,
      );
    }
    return c.json({ ok: true, id: userId });
  } catch (error) {
    console.error("users DELETE /:id error:", error);
    return c.json(
      { message: "Could not delete user", error: "USER_DELETE_FAILED" },
      ERROR_CODE_MAP.INTERNAL_SERVER_ERROR,
    );
  }
});
