# MedSupply

MedSupply is a pharmacy inventory and supply-request system for hospital staff (RKZ). The application is a **Single Page Application (SPA)** with a separate REST API and PostgreSQL database.

This repository is a monorepo:

| Folder | Purpose |
|--------|---------|
| `web/` | React SPA (frontend) |
| `api/` | Hono REST API + authentication |
| `docs/` | Astro Starlight documentation site (this folder) |

---

## Tech stack

### Frontend (`web/`) — SPA

- **React 19** + **TypeScript**
- **Vite** (build tool)
- **TanStack Router** (client-side routing)
- **TanStack Query** (data fetching)
- **Tailwind CSS 4** + **shadcn/ui** (Base UI)
- **Better Auth** (client, session cookies)
- **Zod** (form validation)

### Backend (`api/`)

- **Hono** (HTTP API)
- **Node.js** + **TypeScript**
- **PostgreSQL** + **Drizzle ORM**
- **Better Auth** (email/password login)
- **Zod** (request validation)

### Documentation (`docs/`)

- **Astro 7** + **Starlight**
- Static documentation site (gebruikers- en systeemhandleiding)

### Deployment

- **Railway** (web, api, docs services)
- **pnpm** (package manager)

---

## Prerequisites

- **Node.js** ≥ 22.12 (required for Astro 7 / docs)
- **pnpm** (`npm install -g pnpm`)
- **PostgreSQL** 14+ (local or hosted, e.g. Railway/Neon)
- **Git**

Optional:

- **nvm** (to switch Node versions: `nvm use 22`)

---

## Installation

Clone the repository and install dependencies for each part of the monorepo.

### 1. Clone

```bash
git clone <repository-url>
cd medsupply
```

### 2. API setup

```bash
cd api
pnpm install
cp .env.example .env
```

Edit `api/.env` with your values:

- `DATABASE_URL` — PostgreSQL connection string
- `BETTER_AUTH_SECRET` — long random secret
- `BETTER_AUTH_URL` — API origin (e.g. `http://localhost:5000`)
- `FRONTEND_URL` — frontend origin (e.g. `http://localhost:5173`)

Push schema and seed demo data:

```bash
pnpm db:push
pnpm db:seed
pnpm db:seed:auth-user
```

### 3. Web (SPA) setup

```bash
cd ../web
pnpm install
cp .env.example .env
```

Edit `web/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Docs setup

```bash
cd ../docs
pnpm install
```

---

## Usage

### Run locally (development)

Use **three terminals** (or run api + web; docs is optional):

**Terminal 1 — API**

```bash
cd api
pnpm dev
```

API runs at `http://localhost:5000`.

**Terminal 2 — Web (SPA)**

```bash
cd web
pnpm dev
```

App runs at `http://localhost:5173`.

**Terminal 3 — Documentation (optional)**

```bash
cd docs
pnpm dev
```

Docs run at `http://localhost:4321`.

### Demo accounts

After seeding, log in with:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@medsupply.com` | `Test1234!` |
| Apotheker | `apotheker@medsupply.com` | `Test1234!` |
| Verpleging | `verpleging@medsupply.com` | `Test1234!` |

### Production build

```bash
# API
cd api && pnpm build && pnpm start

# Web (SPA)
cd web && pnpm build && pnpm start

# Docs
cd docs && pnpm build && pnpm start
```

### Railway deployment (summary)

| Service | Root directory | Build command | Start command |
|---------|----------------|---------------|---------------|
| API | `api` | `pnpm install && pnpm build` | `pnpm start:migrate` |
| Web | `web` | `pnpm install && pnpm build` | `pnpm start` |
| Docs | `docs` | `pnpm install && pnpm build` | `pnpm start` |

Set `NODE_VERSION=22` on the docs service. Target port for public networking: **8080** (Railway default).

Environment variables: use `.env.example` files as templates; never commit real `.env` files.

---

## Documentation site — content & menu

The Starlight site in `docs/` contains the user and system manuals.

### Dev mode

```bash
cd docs
pnpm dev
```

Open `http://localhost:4321`. The site reloads when you save Markdown files.

### Content locations

- **Gebruikershandleiding:** `src/content/docs/gebruikers/`
- **Systeemhandleiding:** `src/content/docs/systeem/`

Each page is a `.md` file with frontmatter:

```markdown
---
title: "Inloggen"
sidebar:
  order: 3
---
```

### Sidebar menu

The sidebar is configured in `astro.config.mjs` (not auto-generated from files). Add or reorder pages under the `sidebar:` block.

### Production build (docs only)

```bash
pnpm build    # output in dist/
pnpm preview  # test locally
```

---

## License / submission notes

- Do not commit `.env` files or `node_modules/` (see `.gitignore`).
- Use `.env.example` files as templates for required environment variables.
