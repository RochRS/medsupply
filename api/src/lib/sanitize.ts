// Clean user input before validation (Zod still does the real checks)
// Does NOT replace safe SQL — Drizzle already uses parameters

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const HTML_TAGS = /<\/?[^>]+(>|$)/g;

// Do not HTML-strip these — it would break passwords/tokens
const SKIP_SANITIZE_KEYS = new Set([
  "password",
  "confirmPassword",
  "currentPassword",
  "newPassword",
  "token",
  "accessToken",
  "refreshToken",
]);

// Trim text and remove control chars + basic HTML tags
export function sanitizeString(value: string): string {
  return value.replace(CONTROL_CHARS, "").replace(HTML_TAGS, "").trim();
}

// Walk objects/arrays and sanitize every string
export function sanitizeDeep<T>(value: T, key?: string): T {
  if (typeof value === "string") {
    // Passwords: only remove control chars, keep the rest
    if (key && SKIP_SANITIZE_KEYS.has(key)) {
      return value.replace(CONTROL_CHARS, "") as T;
    }
    return sanitizeString(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeDeep(item, key)) as T;
  }

  if (value !== null && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [nestedKey, nested] of Object.entries(value)) {
      result[nestedKey] = sanitizeDeep(nested, nestedKey);
    }
    return result as T;
  }

  return value;
}
