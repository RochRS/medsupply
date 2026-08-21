---
title: "6. Beveiliging"
sidebar:
  order: 6
---

Dit hoofdstuk beschrijft welke beveiligingsmaatregelen in de MSMS zijn
geïmplementeerd. De beveiliging bestaat uit drie lagen: authenticatie
(wie ben je?), autorisatie (wat mag je?) en databeveiliging (is de data
veilig?).

### 6.1 Authenticatie

Authenticatie is het proces waarbij het systeem controleert of een
gebruiker is wie die zegt te zijn. De MSMS gebruikt hiervoor
**Better Auth**, een authenticatiebibliotheek die inloggen, sessies en
wachtwoordopslag regelt — er wordt dus geen los JWT- of
bcrypt-mechanisme met eigen code onderhouden.

#### 6.1.1 Inlogproces

- De gebruiker vult een e-mailadres en wachtwoord in op het inlogscherm.
- De frontend stuurt dit rechtstreeks naar Better Auth, via
  `POST /api/auth/sign-in/email` (geen eigen login-controller).
- Better Auth vergelijkt het wachtwoord met de opgeslagen hash in de
  `account`-tabel en maakt bij succes een sessie aan in de
  `session`-tabel.
- De sessie wordt bijgehouden via een cookie in de browser (niet via een
  zelfgemaakt JWT-token). De sessie is 7 dagen geldig
  (`expiresIn`) en wordt automatisch verlengd als de gebruiker actief
  blijft (`updateAge`: eenmaal per dag).
- Om niet bij elk verzoek de database te bevragen, wordt de sessiecheck
  5 minuten gecached (`cookieCache`).

Wanneer een admin een account aanmaakt of een wachtwoord reset, krijgt
de gebruiker een tijdelijk wachtwoord (`mustChangePassword = true`). Bij
de eerstvolgende login wordt die gebruiker verplicht doorgestuurd naar
`/change-password` voordat de rest van de applicatie toegankelijk is.

#### 6.1.2 Sessieverificatie per verzoek

Bij elk API-verzoek doorloopt de backend twee middleware-lagen
(`api/src/middleware/auth.ts`):

- **`loadSession`** — controleert bij Better Auth of de meegestuurde
  cookie bij een geldige sessie hoort, en zet de bijbehorende gebruiker
  en rol op de request (of `null` als er geen sessie is).
- **`requireAuth`** — wijst het verzoek af met **401 Unauthorized** als
  er geen geldige sessie is.
- **`requireRole(...rollen)`** — wijst het verzoek af met
  **403 Forbidden** als de rol van de ingelogde gebruiker niet in de
  toegestane lijst voorkomt.

Wachtwoorden worden gehasht opgeslagen (nooit in platte tekst) en moeten
tussen de 8 en 128 tekens lang zijn — dit wordt zowel door Better Auth
als door de Zod-schema's van de applicatie afgedwongen.

### 6.2 Autorisatie (rolgebaseerde toegangscontrole)

De MSMS kent drie gelijkwaardige rollen (geen numerieke hiërarchie):
**admin**, **apotheker** en **verpleging**. Wat een rol mag, wordt per
API-route bepaald met `requireRole(...)`.

#### 6.2.1 Toegangsrechten per API-route

| Route | Toegang |
|-------|---------|
| `GET /api/sessions/me` | Elke ingelogde gebruiker |
| `GET /api/settings` | Iedereen, ook niet-ingelogd (nodig voor het inlogscherm) |
| `PATCH /api/settings` | Alleen **admin** |
| `GET /api/items`, `GET /api/items/:id` | Elke ingelogde gebruiker |
| `POST /PATCH /DELETE /api/items` | **admin** en **apotheker** |
| `GET /api/requests` | Elke ingelogde gebruiker — **verpleging** ziet in de applicatiecode altijd alleen de eigen aanvragen |
| `POST /api/requests` (aanvraag indienen) | Alleen **verpleging** |
| Aanvraag goedkeuren/afhandelen | **admin** en **apotheker** |
| `GET /api/notifications` | Alleen **verpleging** |
| `GET/POST/PATCH/DELETE /api/users` | Alleen **admin** |
| `GET /api/statistics`, `GET /api/history` | Elke ingelogde gebruiker (geen extra rolcontrole — zie hoofdstuk 7) |

De frontend verbergt daarnaast menu-items op basis van de rol (bijv.
Statistieken en Geschiedenis zijn niet zichtbaar voor verpleging), maar
dat is alleen UI-gemak. De echte afdwinging gebeurt op de API via de
tabel hierboven.

### 6.3 Inputvalidatie en databeveiliging

- Alle inkomende request-bodies worden gecontroleerd met **Zod**-schema's
  (`api/src/schemas/`) op type, verplichte velden en formaat (bijv.
  e‑mailformaat, minimale wachtwoordlengte).
- Er bestaat een aparte sanitize-functie
  (`api/src/lib/sanitize.ts`) die controletekens en ruwe HTML-tags uit
  tekstvelden verwijdert, om invoer op te schonen vóór validatie. Deze is
  gekoppeld aan een `validate`-middleware, maar die wordt op dit moment
  alleen gebruikt door een niet-actieve demo-route (zie hoofdstuk 7).
- Drizzle ORM gebruikt geparametriseerde queries, waardoor SQL-injectie
  via de normale databaselaag niet mogelijk is.

### 6.4 Overige beveiligingsmaatregelen

| Maatregel | Status | Toelichting |
|-----------|--------|-------------|
| CORS | Ingeschakeld, beperkt | Alleen de origin uit `FRONTEND_URL` mag cross-origin verzoeken doen (`api/src/index.ts`); niet volledig open. |
| Cookie-instellingen | Actief | `httpOnly` staat altijd aan. `secure` en `sameSite=none` worden automatisch ingeschakeld zodra frontend en backend op verschillende domeinen draaien (bijv. bij een Railway-deploy); anders `sameSite=lax`. |
| Rate limiting | Niet geïmplementeerd | Er is geen middleware die het aantal inlog- of API-pogingen per gebruiker/IP beperkt. |
| Wachtwoordvereisten | Actief | Minimaal 8, maximaal 128 tekens, afgedwongen door zowel Better Auth als de Zod-schema's. |
