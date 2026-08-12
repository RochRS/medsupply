import { createAuthClient } from "better-auth/react";

/**
 * Better Auth expects the server origin (no path). It appends `/api/auth` itself.
 * `VITE_API_URL` often ends with `/api` for apiClient — strip that here.
 */
function getAuthBaseURL(): string {
  const raw =
    import.meta.env.VITE_AUTH_URL?.replace(/\/$/, "") ||
    import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
    import.meta.env.VITE_SERVER_URL?.replace(/\/$/, "") ||
    "http://localhost:5000";

  return raw.replace(/\/api$/, "");
}

export const authClient = createAuthClient({
  baseURL: getAuthBaseURL(),
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;
