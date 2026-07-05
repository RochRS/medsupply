import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Point directly to your Hono backend domain
  baseURL: "http://localhost:3000",
});

// Destructure the hooks you'll use everywhere
export const { signIn, signUp, signOut, useSession } = authClient;
