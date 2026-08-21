---
title: "2. Systeemoverzicht"
sidebar:
  order: 2
---

Dit hoofdstuk beschrijft hoe de verschillende onderdelen van de MSMS
samenwerken. Het geeft inzicht in de technische opbouw, de manier waarop
gegevens worden verwerkt en hoe de database is ingericht.

### 2.1 Technische opbouw

De MSMS bestaat uit twee losse Node.js-applicaties die apart draaien en
via HTTP met elkaar praten:

- **Backend/API** (`api/`): een **Hono**-server die REST-endpoints
  aanbiedt onder `/api/*`, gegevens opslaat in **PostgreSQL** (via
  **Drizzle ORM**) en inloggen/sessies afhandelt via **Better Auth**.
- **Frontend** (`web/`): een **React**-Single Page Application, gebouwd
  met **Vite**, die in de browser draait en via de Fetch API met de
  backend communiceert.

Beide applicaties draaien op hun eigen poort (backend standaard op
`5000`, frontend op `5173`) en communiceren cross-origin met
sessie-cookies.

### 2.2 Verwerking van gegevensstromen

De applicatie verwerkt drie soorten verkeer:

**Pagina-navigatie** Omdat de frontend een SPA is, genereert de server
geen losse HTML-pagina's per verzoek. De client-side router (TanStack
Router) bepaalt welke pagina getoond wordt. Bij het opstarten haalt de
frontend de ingelogde gebruiker op via `GET /api/sessions/me`, zodat
bekend is welke rol iemand heeft en welke onderdelen zichtbaar mogen
zijn.

**API-verzoeken** Wanneer er gegevens worden verstuurd, bijvoorbeeld bij
het indienen van een voorraadaanvraag, stuurt de frontend JSON-data naar
een API-endpoint (bijv. `POST /api/requests`). De server valideert deze
data met Zod, verwerkt de aanvraag via de service-laag en stuurt een
resultaat (JSON) terug.

**Periodieke updates** Voor gegevens die actueel moeten blijven — zoals
meldingen voor verpleging wanneer een aanvraag klaarstaat om op te halen
— haalt de frontend periodiek de laatste stand op (polling via TanStack
Query). Er is geen permanente streaming-verbinding (zoals SSE of
WebSockets); de gebruiker hoeft de pagina niet handmatig te vernieuwen,
maar de gegevens worden met een interval ververst in plaats van
onmiddellijk bij een wijziging.

### 2.3 Database

Alle gegevens worden centraal opgeslagen in een **PostgreSQL**-database.
De applicatie communiceert hiermee via **Drizzle ORM** in combinatie met
de `pg`-driver. Drizzle vertaalt TypeScript-schemadefinities naar
SQL-queries en helpt zo fouten in handgeschreven queries te voorkomen.

Login-gegevens (gebruikers, sessies, wachtwoord-hashes) worden apart
beheerd door **Better Auth**, dat zijn eigen tabellen (`user`, `session`,
`account`, `verification`) binnen dezelfde PostgreSQL-database
gebruikt.
