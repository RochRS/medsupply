# MedSupply API

REST API and authentication backend for the **MedSupply** pharmacy inventory system. This service powers the React **SPA** frontend in `../web/` with JSON endpoints, session-based login (Better Auth), and a PostgreSQL database.

All routes are served under `/api/*`. Authentication routes live at `/api/auth/*`.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| HTTP framework | **Hono** |
| Runtime | **Node.js** + **TypeScript** |
| Database | **PostgreSQL** |
| ORM | **Drizzle ORM** |
| Authentication | **Better Auth** (email/password, sessions) |
| Validation | **Zod** |
| Package manager | **pnpm** |

---

## Prerequisites

- **Node.js** 20+
- **pnpm** (`npm install -g pnpm`)
- **PostgreSQL** 14+ (local install, Docker, or hosted e.g. Railway/Neon)
- **MedSupply Web SPA** (optional for full stack; see `../web/README.md`)

---

## Installation

From the repository root:

```bash
cd api
pnpm install
cp .env.example .env
```

Edit `.env` with your settings:

```env
SERVER_PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/medsupply
BETTER_AUTH_SECRET=your-long-random-secret
BETTER_AUTH_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
DATABASE_TYPE=postgresql
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Secret for signing sessions (never commit) |
| `BETTER_AUTH_URL` | Public URL of this API (no `/api` suffix) |
| `FRONTEND_URL` | SPA origin for CORS and trusted auth origins |
| `SERVER_PORT` | Local dev port (Railway uses `PORT` automatically) |

### Database setup

Push the schema and seed demo data:

```bash
pnpm db:push
pnpm db:seed
pnpm db:seed:auth-user
```

This creates roles, sample inventory, and loginable demo users.

---

## Usage

### Development

```bash
pnpm dev
```

API runs at **http://localhost:5000**.

- Health: `GET /` → `API running`
- API info: `GET /api/`
- Auth: `POST /api/auth/sign-in/email`, etc.

Start the **web SPA** separately (`cd ../web && pnpm dev`) to use the full application.

### Demo accounts

After seeding:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@medsupply.com` | `Test1234!` |
| Apotheker | `apotheker@medsupply.com` | `Test1234!` |
| Verpleging | `verpleging@medsupply.com` | `Test1234!` |

Reset admin password on a deployed database:

```bash
pnpm db:reset-admin:deploy
```

### Production build

```bash
pnpm build
pnpm start
```

Or with automatic schema push on deploy:

```bash
pnpm start:migrate
```

### Useful scripts

| Command | Description |
|---------|-------------|
| `pnpm db:push` | Sync Drizzle schema to PostgreSQL |
| `pnpm db:seed` | Seed all demo data |
| `pnpm db:seed:auth-user` | Seed/update demo login users |
| `pnpm db:studio` | Open Drizzle Studio (DB browser) |
| `pnpm test` | Run Jest tests |

### Railway deployment

| Setting | Value |
|---------|--------|
| Root directory | `api` |
| Build command | `pnpm install && pnpm build` |
| Start command | `pnpm start:migrate` |

Required environment variables:

```
DATABASE_URL=...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=https://your-api.up.railway.app
FRONTEND_URL=https://your-web.up.railway.app
```

---

## API overview

| Route prefix | Auth | Description |
|--------------|------|-------------|
| `/api/auth/*` | Public | Login, logout, session (Better Auth) |
| `/api/sessions/*` | Mixed | Current user session |
| `/api/items` | Protected | Inventory |
| `/api/requests` | Protected | Supply requests |
| `/api/users` | Protected | User admin |
| `/api/statistics` | Protected | Dashboard stats |
| `/api/history` | Protected | Activity history |
| `/api/notifications` | Protected | Pickup notifications |

---

## Notes

- Never commit `.env` — use `.env.example` as a template.
- The SPA sends cookies cross-origin; set `FRONTEND_URL` correctly and use HTTPS in production.
- On live deploy, run `pnpm db:push` before seeding if schema changes were added.
