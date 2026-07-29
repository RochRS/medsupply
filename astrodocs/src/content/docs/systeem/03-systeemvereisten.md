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

  ------------------------------------------------------------------------
  **Software**      **Minimale Versie**     **Toelichting**
  ----------------- ----------------------- ------------------------------
  Node.js           18.0 of hoger           De applicatie draait op
                                            Node.js. Express 5 en bcrypt 6
                                            vereisen minimaal versie 18.

  npm               Meegeleverd met node.js Wordt gebruikt om alle
                                            dependencies te installeren.

  MySQL             MySQL 8.0               De database waarin alle
                                            gegevens worden opgeslagen. De
                                            applicatie maakt verbinding
                                            via de MariaDB-adapter.

  Webbrowser        Moderne versie          Moderne versie Google Chrome,
                                            Firefox, Edge of Safari. De
                                            frontend maakt gebruikt van
                                            JavaScript (ES6+).
  ------------------------------------------------------------------------

### 3.2 Environment variables

De applicatie leest gevoelige instellingen uit een .env-bestand in de
backend-map. Dit bestand moet handmatig worden aangemaakt en bevat de
volgende variabelen:

  -----------------------------------------------------------------------
  **Variables**        **Beschrijving**
  -------------------- --------------------------------------------------
  DATABASE_HOST        Het adres van de databaseserver

  DATABASE_USER        De gebruikersnaam voor de database

  DATABASE_PASSWORD    Het wachtwoord voor de database

  DATABASE_NAME        De naam van de database

  DATABASE_PORT        De poort van de database (standaard: 3306)

  JWT_SECRET           Een unieke geheime sleutel voor het versleutelen
                       van tokens

  SERVER_PORT          De poort waarop de Node.js server luistert
  -----------------------------------------------------------------------

*Let op: Het .env-bestand bevat gevoelige gegevens zoals wachtwoorden.
Deel dit bestand nooit via GitHub of andere openbare kanalen.*

### 3.3 Packages

Alle packages worden automatisch geïnstalleerd via npm install.
Hieronder een overzicht van de belangrijkste en hun functie:

  ----------------------------------------------------------------------------
  **Package**                **Versie**              **Functie**
  -------------------------- ----------------------- -------------------------
  express                    \^5.2.1                 Webserver en API-routing

  \@prisma/client            \^7.4.2                 Databasecommunicatie via
                                                     Prisma ORM

  \@prisma/adapter-mariadb   \^7.4.2                 Verbindingsadapter voor
                                                     MariaDB/MySQL

  bcrypt                     \^6.0.0                 Wachtwoordversleuteling

  jsonwebtoken               \^9.0.3                 Aanmaken en controleren
                                                     van inlogtokens (JWT)

  isomorphic-dompurify       \^3.0.0                 Beveiliging van invoer en
                                                     uitvoer tegen Cross-Site
                                                     Scripting (XSS)

  dotenv                     \^17.3.1                Laadt de environment
                                                     variables uit het
                                                     .env-bestand in de
                                                     applicatie

  cors                       \^2.8.6                 Afhandeling van
                                                     Cross-Origin Resource
                                                     Sharing (CORS)

  cookie-parser              \^1.4.7                 Uitlezen van cookies uit
                                                     inkomende HTTP-requests

  nodemon                    3.1.14                  Herstart de server
                                                     automatisch bij
                                                     codewijzigingen (voor
                                                     gebruik in de development
                                                     environment)
  ----------------------------------------------------------------------------

### 3.4 Database

De applicatie verwacht een MySQL-database met de naam management_system.
Deze database moet aangemaakt worden voordat de applicatie gestart kan
worden. Het SQL-bestand DB setup.sql in de hoofdmap van het project
bevat:

-   Het aanmaken van de database

```{=html}
<!-- -->
```
-   Een trigger (after_request_insert) die de voorraad automatisch
    verlaagt wanneer een aanvraag wordt ingediend

```{=html}
<!-- -->
```
-   Een trigger (after_shipment_insert) die de voorraad automatisch
    verhoogt wanneer een levering wordt geregistreerd

De tabellen zelf worden aangemaakt via Prisma aan de hand van het schema
dat in de applicatie is gedefinieerd.
