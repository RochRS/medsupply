# MedSupply Web (SPA)

Single Page Application for the MedSupply pharmacy inventory and supply-request system. Hospital staff (admin, apotheker, verpleging) use this frontend to manage stock, submit requests, and view statistics.

The app talks to the **MedSupply API** (`../api/`) over HTTP with session cookies (Better Auth).

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Architecture | **SPA** (Single Page Application) |
| UI | **React 19** + **TypeScript** |
| Build | **Vite 8** |
| Routing | **TanStack Router** (client-side) |
| Data fetching | **TanStack Query** |
| Styling | **Tailwind CSS 4** |
| Components | **shadcn/ui** (Base UI primitives) |
| Authentication | **Better Auth** (React client, cookie sessions) |
| Validation | **Zod** |
| Icons | **Hugeicons** |

---

## Prerequisites

- **Node.js** 20+ (22+ recommended if you also run the docs site)
- **pnpm** (`npm install -g pnpm`)
- **MedSupply API** running locally or deployed (see `../api/README.md`)
- A modern browser (Chrome, Firefox, Edge)

---

## Installation

From the repository root:

```bash
cd web
pnpm install
cp .env.example .env
```

Edit `.env` for your environment:

```env
VITE_APP_NAME=MedSupply
VITE_APP_VERSION=1.0.0
VITE_API_URL=http://localhost:5000/api
```

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Base URL of the API including `/api` (used by `apiClient`) |
| `VITE_SERVER_URL` | Optional; auth client falls back to this if `VITE_API_URL` is unset |

Ensure the API is configured with matching `FRONTEND_URL` (e.g. `http://localhost:5173`) for CORS and cookies.

---

## Usage

### Development

Start the API first (`cd ../api && pnpm dev`), then:

```bash
pnpm dev
```

Open **http://localhost:5173** in your browser.

### Demo accounts

After the API database is seeded (`pnpm db:seed:auth-user` in `api/`):

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@medsupply.com` | `Test1234!` |
| Apotheker | `apotheker@medsupply.com` | `Test1234!` |
| Verpleging | `verpleging@medsupply.com` | `Test1234!` |

The login page has demo-account buttons that auto-fill these credentials.

### Production build

```bash
pnpm build
pnpm start
```

- `build` — TypeScript check + Vite production bundle in `dist/`
- `start` — serves `dist/` on port 3000 (or `$PORT` on Railway)

### Other scripts

| Command | Description |
|---------|-------------|
| `pnpm preview` | Preview production build locally |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run Vitest |

### Railway deployment

| Setting | Value |
|---------|--------|
| Root directory | `web` |
| Build command | `pnpm install && pnpm build` |
| Start command | `pnpm start` |

Set environment variable at **build time**:

```
VITE_API_URL=https://your-api.up.railway.app/api
```

---

## Project structure (high level)

```
web/src/
├── routes/          # TanStack Router pages
├── module/          # Page-level UI modules
├── components/      # Reusable UI (global/, ui/, requests/)
├── lib/             # Auth client, utils, cart, roles
└── config/          # API client (api.ts)
```

---

## Notes

- Never commit `.env` — use `.env.example` as a template.
- Session cookies require the API `FRONTEND_URL` and web `VITE_API_URL` to point to the correct deployed origins.
