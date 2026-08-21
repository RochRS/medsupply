---
title: "4. Installatie en configuratie"
sidebar:
  order: 4
---

Dit hoofdstuk beschrijft stap voor stap hoe de MSMS geïnstalleerd en
geconfigureerd wordt. De stappen zijn bedoeld voor een schone
installatie op een nieuwe development environment.

### 4.1 Projectbestanden ophalen

Clone de broncode van het project via GitHub:

```bash
git clone https://github.com/RochRS/medsupply.git
cd medsupply
```

Het project heeft de volgende hoofdmappen:

| Map | Inhoud |
|-----|--------|
| `api/` | De Hono-server, API-routes, Drizzle-schema en -migraties |
| `web/` | De React-SPA (frontend): routes, componenten en styling |
| `docs/` | Deze documentatiesite (Astro Starlight) |

### 4.2 Dependencies installeren

Het project gebruikt **pnpm** als package manager (niet npm). Installeer
dit eenmalig globaal als het nog niet aanwezig is:

```bash
npm install -g pnpm
```

Installeer daarna de dependencies voor zowel de backend als de frontend,
elk in hun eigen map:

```bash
cd api
pnpm install

cd ../web
pnpm install
```

Dit installeert alle packages uit de bijbehorende `package.json`, zoals
Hono, Drizzle ORM en Better Auth voor de backend, en React, Vite en
Tailwind CSS voor de frontend. Er hoeft niets handmatig gedownload of
op een vast pad geplaatst te worden — dat gebeurt allemaal automatisch
via `pnpm install`.

### 4.3 Environment variables instellen

Zowel `api/` als `web/` heeft een eigen `.env`-bestand, gebaseerd op het
meegeleverde `.env.example`.

**Backend (`api/.env`):**

```bash
cd api
cp .env.example .env
```

```bash
SERVER_PORT=5000
DATABASE_URL=postgresql://<gebruiker>:<wachtwoord>@localhost:5432/medsupply
DATABASE_TYPE=postgresql
BETTER_AUTH_SECRET=<lange_willekeurige_geheime_sleutel>
BETTER_AUTH_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

**Frontend (`web/.env`):**

```bash
cd ../web
cp .env.example .env
```

```bash
VITE_API_URL=http://localhost:5000/api
```

Vervang de waarden tussen `< >` door de daadwerkelijke gegevens van de
omgeving. `FRONTEND_URL` (backend) en `VITE_API_URL` (frontend) moeten
op elkaar aansluiten, anders werken cookies/CORS niet correct.

*Let op: Beide `.env`-bestanden staan in `.gitignore` en worden niet mee
gepusht naar de remote repository. Ze moeten op elke development
environment handmatig worden aangemaakt.*

### 4.4 Database opzetten

De MSMS gebruikt **PostgreSQL**. Zorg dat er een lokale of gehoste
Postgres-instantie draait en dat de database uit `DATABASE_URL` bestaat.

Het schema wordt niet via een los SQL-bestand aangemaakt, maar via
Drizzle ORM, aan de hand van het schema in `api/src/database/schemas/`.
Voer vanuit de `api/`-map uit:

```bash
pnpm db:push
```

Dit synchroniseert alle tabellen (o.a. `items`, `request`, `shipments`,
`categories`, `suppliers`, `user`, `role`, `app_settings`) rechtstreeks
naar de database. Er is geen aparte "generate client"-stap zoals bij
Prisma — Drizzle gebruikt het TypeScript-schema direct.

Laad daarna de demodata en testgebruikers in:

```bash
pnpm db:seed
pnpm db:seed:auth-user
```

Dit maakt rollen, voorbeeldvoorraad en drie inlogbare demo-accounts aan
(admin, apotheker, verpleging — zie hoofdstuk 5 voor de inloggegevens).

Het bijwerken van de voorraad bij een aanvraag of levering gebeurt in de
backend-code zelf (in een databasetransactie), niet via
database-triggers.

### 4.5 Applicatie starten

Start backend en frontend in twee aparte terminals, elk vanuit hun
eigen map.

**Backend:**

```bash
cd api
pnpm dev
```

Bij een correcte configuratie verschijnt in de terminal:

```
Server is running on http://localhost:5000
Auth endpoints: http://localhost:5000/api/auth/*
Frontend origin (CORS): http://localhost:5173
```

**Frontend:**

```bash
cd web
pnpm dev
```

De applicatie is nu bereikbaar via de browser op
**http://localhost:5173**.

### 4.6 Overzicht van de installatiestappen

| Stap | Commando / Actie | Locatie |
|------|-------------------|---------|
| 1 | `git clone ...` | Hoofdmap |
| 2 | `pnpm install` | `api/` en `web/` |
| 3 | `.env` aanmaken en invullen | `api/` en `web/` |
| 4 | `pnpm db:push` | `api/` |
| 5 | `pnpm db:seed` + `pnpm db:seed:auth-user` | `api/` |
| 6 | `pnpm dev` | `api/` |
| 7 | `pnpm dev` | `web/` |
