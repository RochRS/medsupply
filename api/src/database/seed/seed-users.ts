/**
 * Profile-only demo users are no longer seeded.
 * Login accounts live in seed-auth-user (exactly 1 per role).
 */
export async function seed() {
  console.log(
    "  ∼ users: skipped (1 account per role is created by seed-auth-user)",
  );
  return [];
}

const isMain = process.argv[1]?.includes("seed-users");
if (isMain) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ seed-users failed:", err);
      process.exit(1);
    });
}
