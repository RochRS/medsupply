import { createAuthClient } from "better-auth/react";

// API base URL from Vite env (fallback for local dev)
const baseURL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  import.meta.env.VITE_SERVER_URL?.replace(/\/$/, "") ||
  "http://localhost:5000";

export const authClient = createAuthClient({
  baseURL,
  // Send cookies so the session works (frontend :5173 → API :5000)
  fetchOptions: {
    credentials: "include",
  },
});

// Helpers used on login / logout pages
export const { signIn, signUp, signOut, useSession } = authClient;
