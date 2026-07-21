import type { AuthSession, AuthUser } from "../auth/auth.js";

// Values we attach to each Hono request (see middleware)
export type AppVariables = {
  user: AuthUser | null;
  session: AuthSession | null;
  validated: unknown; // set by the validate() middleware
};

export type AppEnv = {
  Variables: AppVariables;
};
