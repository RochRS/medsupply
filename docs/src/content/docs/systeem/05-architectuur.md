---
title: "5. Architectuur"
sidebar:
  order: 5
---

Dit hoofdstuk beschrijft de technische architectuur van de MSMS. Het
geeft een overzicht van de gebruikte technologieën, de mappenstructuur
van het project en het databasemodel (ERD).

### 5.1 Technologieën

De MSMS is een webapplicatie met een client-side frontend en een
server-side backend. Hieronder een overzicht van alle gebruikte
technologieën per onderdeel:

| Onderdeel | Technologie | Rol |
|-----------|-------------|-----|
| Frontend | React 19 + TypeScript, Vite | Single Page Application: structuur, weergave en interactie |
| Routing/data (frontend) | TanStack Router + TanStack Query | Client-side navigatie en het ophalen/cachen van data |
| Styling | Tailwind CSS + shadcn/ui | Layout, responsive design en herbruikbare UI-componenten |
| Backend | Node.js met Hono | Webserver en REST-API |
| Database | PostgreSQL | Opslag en beheer van alle gegevens |
| ORM | Drizzle ORM (+ `pg`-driver) | Verbinding en communicatie tussen backend en database |
| Authenticatie | Better Auth | Inloggen, sessiebeheer via cookies en wachtwoordversleuteling |
| Validatie | Zod | Controle van inkomende data op vorm en inhoud |
| Autorisatie | Rolgebaseerde toegangscontrole | Drie rollen: admin, apotheker, verpleging |
| Configuratie | dotenv | Laadt environment variables uit het `.env`-bestand |

De communicatie tussen frontend en backend verloopt via HTTP-requests
(Fetch API), met sessie-cookies voor authenticatie. Voor gegevens die
actueel moeten blijven (zoals meldingen) wordt periodiek opnieuw
opgevraagd (polling) in plaats van een permanente streaming-verbinding.

### 5.2 Mappenstructuur

Het project bestaat uit drie hoofdmappen: `api/` (backend), `web/`
(frontend) en `docs/` (deze documentatie). Binnen `api/` en `web/` is de
code gelaagd opgebouwd, waarbij elke map een eigen verantwoordelijkheid
heeft.

**Backend (`api/src/`):**

```
api/src/
├── routes/          # HTTP-routes per onderwerp (items, requests, users, ...)
├── services/        # Bedrijfslogica en databasequeries per onderwerp
├── middleware/       # requireAuth, requireRole, validate, ...
├── schemas/          # Zod-validatieschema's voor inkomende data
├── database/
│   ├── schemas/      # Drizzle-tabeldefinities (TypeScript)
│   └── seed/         # Scripts om demodata/testgebruikers te vullen
├── auth/             # Better Auth-configuratie
├── lib/               # Hulpfuncties, o.a. input-sanitization
└── constants/         # o.a. HTTP-statuscodes
```

**Frontend (`web/src/`):**

```
web/src/
├── routes/           # Pagina's, gekoppeld via TanStack Router
├── module/            # Pagina-specifieke UI-blokken en logica
├── components/
│   ├── global/        # Layout, navigatie, gedeelde UI-onderdelen
│   └── ui/             # Basis UI-componenten (shadcn/ui)
├── lib/                # Auth-client, rollen, cart, app-instellingen
├── config/             # API-client (api.ts)
└── schemas/            # Zod-validatie voor formulieren
```

Een verzoek van een gebruiker loopt dus: **frontend-route** →
**Fetch-call naar `/api/...`** → **route in `api/src/routes/`** →
**validatie (Zod)** → **service-laag** → **Drizzle ORM** →
**PostgreSQL**, en het antwoord loopt in omgekeerde richting terug als
JSON.

### 5.3 Entity Relationship Diagram (ERD)

Het databaseschema van de MSMS is gedefinieerd in TypeScript, in
`api/src/database/schemas/`, en wordt beheerd via Drizzle ORM. De
database bevat dertien tabellen, onderverdeeld in vier groepen.

#### 5.3.1 Tabellen

**Authenticatie (beheerd door Better Auth):**

| Tabel | Kolommen | Beschrijving |
|-------|----------|--------------|
| `user` | id (PK), name, email, emailVerified, image, roleId (FK), departmentId (FK), mustChangePassword, createdAt, updatedAt | Alle applicatiegebruikers en hun rol/afdeling. |
| `session` | id (PK), token, expiresAt, ipAddress, userAgent, userId (FK) | Actieve login-sessies (cookiegebaseerd). |
| `account` | id (PK), accountId, providerId, userId (FK), password, ... | Inloggegevens per gebruiker, o.a. het gehashte wachtwoord. |
| `verification` | id (PK), identifier, value, expiresAt | Infrastructuur van Better Auth voor verificatietokens. |

**Rollen en organisatie:**

| Tabel | Kolommen | Beschrijving |
|-------|----------|--------------|
| `role` | roleId (PK), roleName | De drie rollen: admin, apotheker, verpleging. |
| `department` | departmentId (PK), departmentName | Afdelingen binnen het St. Vincentius Ziekenhuis. |

**Voorraad en aanvragen:**

| Tabel | Kolommen | Beschrijving |
|-------|----------|--------------|
| `categories` | categoryId (PK), categoryName, categoryDescription, icon | Groepering van medische middelen. |
| `items` | itemId (PK), itemName, description, remainingAmount, categoryId (FK) | De centrale catalogus van medische artikelen en hun actuele voorraadstand. |
| `request` | requestId (PK), requestBatchId, requestedAmount, isUrgent, status, isCompleted, itemId (FK), userId (FK), departmentId, requestDescriptionId (FK) | Aanvragen voor medische middelen. |
| `requestDescription` | requestDescriptionId (PK), requestDescriptionField | Vaste beschrijvingsteksten bij aanvragen. |
| `shipments` | shipmentId (PK), shipmentBatchId, GTIN, experationDate, cost, deliveryDate, itemId (FK), suppliersId (FK) | Inkomende leveringen van leveranciers. |
| `suppliers` | supplierId (PK), supplierName, address, description, contactInfo | Leveranciers van medische middelen. |

**Applicatie-instellingen:**

| Tabel | Kolommen | Beschrijving |
|-------|----------|--------------|
| `app_settings` | id (PK, altijd 1), appName, updatedAt | Eén rij met instelbare applicatienaam, door een admin te wijzigen. |

Toelichting: PK = Primary Key (unieke identificatie per record), FK =
Foreign Key (verwijzing naar een record in een andere tabel).

#### 5.3.2 Relaties tussen tabellen

De belangrijkste relaties (one-to-many, "A ──< B" betekent: één record
in A hoort bij meerdere records in B):

- `role` ──< `user` (elke gebruiker heeft precies één rol)
- `department` ──< `user` (optioneel: een gebruiker kan aan een afdeling gekoppeld zijn)
- `user` ──< `session`, `user` ──< `account` (Better Auth: sessies en inloggegevens per gebruiker)
- `categories` ──< `items` (een categorie bevat meerdere artikelen)
- `items` ──< `request` en `items` ──< `shipments` (een artikel heeft meerdere aanvragen en leveringen)
- `user` ──< `request` (een gebruiker dient meerdere aanvragen in)
- `requestDescription` ──< `request` (een beschrijving kan bij meerdere aanvragen horen)
- `suppliers` ──< `shipments` (een leverancier verzorgt meerdere leveringen)

#### 5.3.3 Bijwerken van de voorraad

In tegenstelling tot een opzet met database-triggers, gebeurt het
bijwerken van de voorraad in de MSMS **in de applicatiecode**, niet in
de database zelf:

- Bij het **goedkeuren** van een aanvraag (`approveRequest` in
  `api/src/services/requests.service.ts`) wordt binnen één
  databasetransactie eerst gecontroleerd of er genoeg voorraad is, en
  daarna wordt `items.remainingAmount` verlaagd met het aangevraagde
  aantal.
- Er is geen aparte functionaliteit die de voorraad bij een levering
  automatisch verhoogt op basis van een trigger; het bijwerken van
  voorraad gebeurt uitsluitend via de request-flow hierboven.

Zie hoofdstuk 7 voor een kanttekening bij deze aanpak onder gelijktijdig
gebruik.
