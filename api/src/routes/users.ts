import { Hono } from "hono";
import type { AppEnv } from "../types/hono.js";
import { ERROR_CODE_MAP } from "../constants/http-status-codes.js";
import {
  getUserProfile,
  resolveUserId,
  updateUserProfile,
} from "../services/users.service.js";
import type { UpdateUserProfileInput } from "../services/users.service.js";

export const users = new Hono<AppEnv>();

// GET /users — current user profile (with role + department)
users.get("/", async (c) => {
  const currentUser = c.get("user");

  try {
    const userId = await resolveUserId(currentUser?.id);

    if (!userId) {
      return c.json(
        { message: "No user found", error: "USER_NOT_FOUND" },
        ERROR_CODE_MAP.NOT_FOUND,
      );
    }

    const profile = await getUserProfile(userId);

    if (!profile) {
      return c.json(
        { message: "User not found", error: "USER_NOT_FOUND" },
        ERROR_CODE_MAP.NOT_FOUND,
      );
    }

    return c.json({ user: profile });
  } catch (error) {
    console.error("users GET / error:", error);
    return c.json(
      { message: "Could not load profile", error: "USER_FETCH_FAILED" },
      ERROR_CODE_MAP.INTERNAL_SERVER_ERROR,
    );
  }
});

// PATCH /users — update the current user profile (name / email / department)
users.patch("/", async (c) => {
  const currentUser = c.get("user");

  const body = await c.req.json<UpdateUserProfileInput>();

  if (!body.name && !body.email && body.departmentId === undefined) {
    return c.json(
      { message: "No fields to update", error: "VALIDATION_ERROR" },
      ERROR_CODE_MAP.BAD_REQUEST,
    );
  }

  const data: UpdateUserProfileInput = {
    ...(body.name?.trim() ? { name: body.name.trim() } : {}),
    ...(body.email?.trim() ? { email: body.email.trim().toLowerCase() } : {}),
    ...(body.departmentId !== undefined
      ? { departmentId: body.departmentId }
      : {}),
  };

  if (Object.keys(data).length === 0) {
    return c.json(
      { message: "No fields to update", error: "VALIDATION_ERROR" },
      ERROR_CODE_MAP.BAD_REQUEST,
    );
  }

  try {
    const userId = await resolveUserId(currentUser?.id);

    if (!userId) {
      return c.json(
        { message: "No user found", error: "USER_NOT_FOUND" },
        ERROR_CODE_MAP.NOT_FOUND,
      );
    }

    const updated = await updateUserProfile(userId, data);

    if (!updated) {
      return c.json(
        { message: "User not found", error: "USER_NOT_FOUND" },
        ERROR_CODE_MAP.NOT_FOUND,
      );
    }

    return c.json({ user: updated, message: "Profile updated" });
  } catch (error) {
    console.error("users PATCH / error:", error);
    return c.json(
      { message: "Could not update profile", error: "USER_UPDATE_FAILED" },
      ERROR_CODE_MAP.INTERNAL_SERVER_ERROR,
    );
  }
});
