import { z } from "zod";

// ---- shared field rules ----

const emailField = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email address")
  .max(255, "Email is too long")
  .transform((value) => value.toLowerCase());

const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long");

// ---- schemas ----

export const loginSchema = z
  .object({
    email: emailField,
    password: z.string().min(1, "Password is required").max(128),
  })
  .strict();

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),
    email: emailField,
    password: passwordField,
  })
  .strict();

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

const nameField = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name is too long");

const roleIdField = z
  .number()
  .int("roleId must be an integer")
  .positive("roleId must be positive")
  .nullable()
  .optional();

export const adminCreateUserSchema = z
  .object({
    name: nameField,
    email: emailField,
    /** Optional — server generates a temporary password if omitted */
    password: passwordField.optional(),
    roleId: roleIdField,
  })
  .strict();

export const adminUpdateUserSchema = z
  .object({
    name: nameField.optional(),
    email: emailField.optional(),
    password: passwordField.optional(),
    /** Generate a new temporary password (forces change on next login) */
    regeneratePassword: z.boolean().optional(),
    roleId: roleIdField,
  })
  .strict()
  .refine(
    (data) =>
      data.name !== undefined ||
      data.email !== undefined ||
      data.password !== undefined ||
      data.regeneratePassword === true ||
      data.roleId !== undefined,
    { message: "At least one field is required" },
  );

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required").max(128),
    newPassword: passwordField,
  })
  .strict()
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from the current password",
    path: ["newPassword"],
  });

export type AdminCreateUserInput = z.infer<typeof adminCreateUserSchema>;
export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;