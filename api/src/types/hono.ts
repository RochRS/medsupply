import type { AuthSession, AuthUser } from "../auth/auth.js";
import type { UserRole } from "../services/users.service.js";

export type AppVariables = {
  user: AuthUser | null;
  session: AuthSession | null;
  role: UserRole | null;
  validated: unknown;
};

export type AppEnv = {
  Variables: AppVariables;
};
