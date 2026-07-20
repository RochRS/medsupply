import { sanitizeDeep, sanitizeString } from "../lib/sanitize.js";
import { loginSchema, registerSchema } from "../schemas/user-login.js";

// Tests for sanitization helpers and Zod schemas

describe("sanitizeString", () => {
  it("trims whitespace", () => {
    expect(sanitizeString("  hello  ")).toBe("hello");
  });

  it("strips basic HTML tags", () => {
    expect(sanitizeString("<script>alert(1)</script>test")).toBe("alert(1)test");
  });

  it("removes control characters", () => {
    expect(sanitizeString("a\u0000b\u0007c")).toBe("abc");
  });
});

describe("sanitizeDeep", () => {
  it("sanitizes nested objects", () => {
    const input = {
      name: "  <b>Jan</b>  ",
      nested: { note: "<img src=x onerror=alert(1)>" },
      tags: [" <i>a</i> ", "b"],
    };

    expect(sanitizeDeep(input)).toEqual({
      name: "Jan",
      nested: { note: "" },
      tags: ["a", "b"],
    });
  });

  it("does not strip HTML-like characters from password fields", () => {
    const input = {
      email: "  Nurse@RKZ.sr  ",
      password: "p@ss<script>1",
    };

    expect(sanitizeDeep(input)).toEqual({
      email: "Nurse@RKZ.sr",
      password: "p@ss<script>1",
    });
  });
});

describe("loginSchema", () => {
  it("accepts a valid login payload", () => {
    const result = loginSchema.safeParse({
      email: "Nurse@RKZ.sr",
      password: "secret123",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("nurse@rkz.sr");
    }
  });

  it("rejects extra fields (strict)", () => {
    const result = loginSchema.safeParse({
      email: "nurse@rkz.sr",
      password: "secret123",
      role: "admin",
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "secret123",
    });

    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("requires password length >= 8", () => {
    const result = registerSchema.safeParse({
      name: "Jan",
      email: "jan@rkz.sr",
      password: "short",
    });

    expect(result.success).toBe(false);
  });

  it("accepts a valid register payload", () => {
    const result = registerSchema.safeParse({
      name: "Jan de Vries",
      email: "jan@rkz.sr",
      password: "veiligWachtwoord1",
    });

    expect(result.success).toBe(true);
  });
});
