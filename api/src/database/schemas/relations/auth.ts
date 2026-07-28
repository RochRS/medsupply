import { relations } from "drizzle-orm";
import { user, session, account, role, department } from "../auth-schema.js";
import { request } from "../core.js";

export const userRelations = relations(user, ({ one, many }) => ({
  sessions: many(session),
  accounts: many(account),
  role: one(role, {
    fields: [user.roleId],
    references: [role.roleId],
  }),
  department: one(department, {
    fields: [user.departmentId],
    references: [department.departmentId],
  }),
  requests: many(request),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const roleRelations = relations(role, ({ many }) => ({
  users: many(user),
}));

export const departmentRelations = relations(department, ({ many }) => ({
  users: many(user),
}));
