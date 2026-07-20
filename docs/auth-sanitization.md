# Authentication & Sanitization (MedSupply / RKZ)

Backend-eigenaarschap: session cookies via **better-auth**, input checks via **Zod** + lichte **sanitization**.

## Wat doet dit?

| Laag | Technologie | Rol |
|------|-------------|-----|
| Auth | better-auth + Drizzle + PostgreSQL | Registreren, inloggen, sessie-cookies, uitloggen |
| Guards | `loadSession` / `requireAuth` | Publieke vs beschermde API-routes |
| Validatie | Zod schema's | Structuur + types van request bodies |
| Sanitization | `sanitizeDeep` | Trim, control chars, basis HTML-tags weg (niet bij wachtwoorden) |
| SQL-veiligheid | Drizzle ORM | Parameterized queries (geen string-concat SQL) |

## Endpoints

| Method | Pad | Auth? | Doel |
|--------|-----|-------|------|
| `POST/GET` | `/api/auth/*` | nee | better-auth (sign-in, sign-up, sign-out, session) |
| `GET` | `/api/session/health` | nee | Healthcheck auth-laag |
| `GET` | `/api/session/me` | ja | Huidige user + session |
| `POST` | `/api/validate-login-payload` | nee | Demo: Zod + sanitize (geen echte login) |
| `*` | `/api/dashboard`, `/requests`, … | ja | Beschermde app-routes |

Frontend praat met better-auth via `web/src/lib/auth-client.ts` (`signIn.email`, enz.).

## Omgeving

`api/.env` (zie `api/example.env`):

- `SERVER_PORT=5000`
- `DATABASE_URL=postgresql://...`
- `BETTER_AUTH_SECRET=` (lang willekeurig geheim)
- `BETTER_AUTH_URL=http://localhost:5000`
- `FRONTEND_URL=http://localhost:5173`

`web/.env`:

- `VITE_SERVER_URL=http://localhost:5000`
- `VITE_API_URL=http://localhost:5000/api`

## Lokaal starten

```powershell
# Terminal 1 — API
cd E:\medsupply\api
pnpm db:push
pnpm dev

# Terminal 2 — Web
cd E:\medsupply\web
pnpm dev
```

Eerste gebruiker aanmaken (bijv. via better-auth sign-up of API-client):

`POST http://localhost:5000/api/auth/sign-up/email`  
body: `{ "name": "...", "email": "...", "password": "..." }`

Daarna inloggen op `http://localhost:5173`.

## Best practices (AI / school)

1. Geen secrets in git — alleen `example.env` committen.
2. Validatie **en** sanitization: Zod voor structuur, sanitize voor rommel/XSS in tekstvelden.
3. Wachtwoorden niet HTML-strippen (alleen control chars).
4. Nooit raw SQL met user-input; altijd Drizzle/parameters.
5. Beschermde routes altijd achter `requireAuth`.

## Tests

```powershell
cd E:\medsupply\api
pnpm test -- sanitize.test.ts
```
