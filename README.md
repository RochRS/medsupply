# MedSupply

Hospital pharmacy inventory and supply-request system for **St. Vincentius Ziekenhuis (RKZ)**. Staff can view stock, submit supply requests, approve urgent orders, and track history — with role-based access for admin, apotheker, and verpleging.

The project is a **Single Page Application (SPA)** backed by a REST API and PostgreSQL database, with a separate documentation site.

---

## Project description

MedSupply replaces manual or fragmented stock tracking with one web application:

- **Verpleging** browses inventory and submits requests (regular or urgent)
- **Apotheker / admin** manages stock, approves requests, and views statistics
- **Admin** manages users and roles

Requests are grouped by batch, notifications alert staff when orders are ready for pickup, and history/statistics support auditing and planning.

---

## Components of the project

This repository is a **monorepo** with three main parts:

| Component | Folder | Description |
|-----------|--------|-------------|
| **Web (SPA)** | [web/](web/) | React frontend — login, dashboard, inventory, requests, statistics, history, admin |
| **API** | [api/](api/) | Hono REST API — auth (Better Auth), CRUD, business logic, PostgreSQL via Drizzle |
| **Documentation** | [docs/](docs/) | Astro Starlight site — gebruikers- and systeemhandleiding |

Each component has its own README with setup details:

- [Web README](web/README.md) — SPA installation and usage
- [API README](api/README.md) — backend installation and usage
- [Docs README](docs/README.md) — documentation site and full monorepo guide

---

## Tech stack

| Layer | Technologies |
|-------|----------------|
| Frontend | React 19, TypeScript, Vite, TanStack Router, TanStack Query, Tailwind CSS, shadcn/ui |
| Backend | Hono, Node.js, TypeScript, Drizzle ORM, PostgreSQL, Better Auth, Zod |
| Docs | Astro 7, Starlight |
| Tooling | pnpm, ESLint, Vitest, Jest |

---

## Prerequisites

- **Node.js** >= 22.12 (docs); **20+** for api/web
- **pnpm**
- **PostgreSQL** 14+
- **Git**

---

## Installation (quick start)

```bash
git clone <repository-url>
cd medsupply

# API
cd api && pnpm install

# If prompted with ERR_PNPM_IGNORED_BUILDS, approve build scripts:
pnpm approve-builds
cp .env.example .env

# Edit .env (DATABASE_URL, BETTER_AUTH_SECRET, URLs)
# Generate a real BETTER_AUTH_SECRET instead of the placeholder:
npx @better-auth/cli secret

# Create the database if it doesn't exist yet:
createdb medsupply
pnpm db:push && pnpm db:seed && pnpm db:seed:auth-user

# Web SPA
cd ../web && pnpm install && cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api

# Docs (optional)
cd ../docs && pnpm install

# If prompted with ERR_PNPM_IGNORED_BUILDS, approve build scripts:
pnpm approve-builds
```

See component READMEs for full instructions and environment variables.

---

## Usage

Run the API and web app in separate terminals:

```bash
# Terminal 1
cd api && pnpm dev

# Terminal 2
cd web && pnpm dev
```

- **App:** http://localhost:5173
- **API:** http://localhost:5000
- **Docs:** http://localhost:4321 (`cd docs && pnpm dev`)

### Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@medsupply.com | Test1234! |
| Apotheker | apotheker@medsupply.com | Test1234! |
| Verpleging | verpleging@medsupply.com | Test1234! |

---

## Deployment

Deployed on **Railway** as three services (web, api, docs). See [docs/README.md](docs/README.md) for build/start commands and environment variables.

---

## Submission notes

- Do **not** commit `.env` files or `node_modules/` (use `.env.example` templates).
- Root README describes the project; per-component setup is in `web/`, `api/`, and `docs/` README files.
