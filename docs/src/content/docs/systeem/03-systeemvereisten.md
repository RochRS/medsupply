---
title: "3. Systeemvereisten"
sidebar:
  order: 3
---

Dit hoofdstuk beschrijft welke software, instellingen en dependencies
nodig zijn om de MSMS te kunnen installeren en draaien. Per onderdeel
wordt toegelicht wat het is, waarom het nodig is en welke versie wordt
verwacht.

### 3.1 Software

De volgende software moet geïnstalleerd zijn op de server of development
environment:

| Software | Minimale versie | Toelichting |
|----------|-----------------|-------------|
| Node.js | 20.0 of hoger | De applicatie (backend en frontend) draait op Node.js met TypeScript. |
| pnpm | Nieuwste versie | Het project gebruikt pnpm (niet npm) om dependencies te installeren en scripts uit te voeren, zowel in de `api`- als de `web`-map. |
| PostgreSQL | 14.0 of hoger | De database waarin alle gegevens worden opgeslagen. De applicatie maakt verbinding via de `pg`-driver, aangestuurd door Drizzle ORM. |
| Webbrowser | Moderne versie | Moderne versie van Google Chrome, Firefox, Edge of Safari. De frontend is een React-SPA en maakt gebruik van moderne JavaScript (ES2020+). |

### 3.2 Environment variables

De backend leest gevoelige instellingen uit een `.env`-bestand in de
`api`-map. Dit bestand moet handmatig worden aangemaakt (op basis van
`.env.example`) en bevat de volgende variabelen:

| Variabele | Beschrijving |
|-----------|--------------|
| `SERVER_PORT` | De poort waarop de Node.js-server lokaal luistert (standaard 5000). |
| `DATABASE_URL` | De volledige PostgreSQL-connectiestring (host, gebruiker, wachtwoord, databasenaam, poort). |
| `DATABASE_TYPE` | Geeft aan dat het databasetype `postgresql` is. |
| `BETTER_AUTH_SECRET` | Een unieke geheime sleutel waarmee Better Auth sessies ondertekent. |
| `BETTER_AUTH_URL` | De publieke URL van deze API (zonder `/api`-suffix), gebruikt door Better Auth. |
| `FRONTEND_URL` | De URL van de web-SPA; nodig voor CORS en als vertrouwde origin voor Better Auth. |

*Let op: Het `.env`-bestand bevat gevoelige gegevens zoals wachtwoorden en
geheime sleutels. Deel dit bestand nooit via GitHub of andere openbare
kanalen.*

### 3.3 Packages

Alle packages worden automatisch geïnstalleerd via `pnpm install`.
Hieronder een overzicht van de belangrijkste en hun functie:

| Package | Versie | Functie |
|---------|--------|---------|
| hono | ^4.12.27 | Webserver en API-routing |
| @hono/node-server | ^2.0.8 | Laat Hono draaien bovenop de standaard Node.js-server |
| drizzle-orm | 0.45.2 | Databasecommunicatie via Drizzle ORM |
| drizzle-kit | 0.31.10 | Genereert en synchroniseert het databaseschema (migraties) met PostgreSQL |
| pg | ^8.22.0 | PostgreSQL-driver waarmee Drizzle verbinding maakt met de database |
| better-auth | ^1.6.23 | Authenticatie: inloggen, sessiebeheer via cookies en wachtwoordversleuteling |
| zod | ^4.4.3 | Validatie van inkomende data (request-bodies) |
| dotenv | ^17.4.2 | Laadt de environment variables uit het `.env`-bestand in de applicatie |
| tsx | ^4.23.0 | Draait de TypeScript-server direct en herstart deze automatisch bij codewijzigingen (development) |

### 3.4 Database

De applicatie verwacht een PostgreSQL-database (bijvoorbeeld `medsupply`,
in te stellen via `DATABASE_URL`). Het databaseschema (tabellen, kolommen,
relaties) wordt niet via een los SQL-bestand aangemaakt, maar via Drizzle
ORM:

- Het schema staat gedefinieerd in TypeScript in
  `api/src/database/schemas/`.
- Met `pnpm db:push` wordt dit schema rechtstreeks naar de database
  gesynchroniseerd. Met `pnpm db:generate` (en `pnpm db:migrate`) kunnen
  in plaats daarvan losse, versiebeheerde migratiebestanden aangemaakt en
  toegepast worden.
- Demo-data (rollen, voorraad, testgebruikers) wordt apart ingeladen via
  seed-scripts, bijvoorbeeld `pnpm db:seed` en `pnpm db:seed:auth-user`.

Het bijwerken van de voorraad — verlagen bij een aanvraag, verhogen bij
een levering — gebeurt in de applicatiecode zelf (in de backend-services),
binnen een databasetransactie, en niet via database-triggers.
