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

git clone https://github.com/JelOrg/School-Fullstack.git

cd School-Fullstack

Het project heeft de volgende hoofdmappen:

  -----------------------------------------------------------------------
  **Map**                             **Inhoud**
  ----------------------------------- -----------------------------------
  backend/                            De Express-server, API-routes,
                                      Prisma-configuratie

  frontend/                           HTML-pagina\'s, CSS-stijlen,
                                      JavaScript-bestanden
  -----------------------------------------------------------------------

### 4.2 Packages installeren (npm install)

Navigeer naar de backend-map en installeer alle packages:

cd backend

npm install

Dit installeert alle packages die in package.json staan, waaronder
Express, Prisma, bcrypt en de overige packages.

### 4.3 Bootstrap installeren

De frontend maakt gebruik van Bootstrap 5.3.8 voor de styling en layout.
Deze package is niet opgenomen in de Git-repository en moet handmatig
worden toegevoegd.

1.  Download Bootstrap 5.3.8 via getbootstrap.com

2.  Plaats de uitgepakte map in: frontend/css/bootstrap-5.3.8-dist/

De HTML-bestanden verwachten Bootstrap op dit exacte pad:
frontend/css/bootstrap-5.3.8-dist/css/bootstrap.min.css

### 4.4 Environment variables instellen

Maak een nieuw bestand aan met de naam .env in de backend-map:
backend/.env

Vul het bestand met de volgende variabelen:

DATABASE_HOST=localhost

DATABASE_USER=\<gebruikersnaam\>

DATABASE_PASSWORD=\<wachtwoord\>

DATABASE_NAME=management_system

DATABASE_PORT=3306

JWT_SECRET=\<geheime_sleutel\>

SERVER_PORT=5500

Vervang de waarden tussen \< \> door de daadwerkelijke gegevens van de
omgeving.

*Let op: Dit bestand staat in .gitignore en wordt niet mee gepusht naar
de remote repository. Het moet op elke development environment handmatig
worden aangemaakt.*

### 4.5 Database opzetten

De database wordt in twee stappen opgezet: eerst de database zelf met
triggers, daarna de tabellen via Prisma.

Stap 1: Database en triggers aanmaken

Open een MySQL-client en voer het bestand DB setup.sql uit dat in de
hoofdmap van het project staat. Dit script:

-   Maakt de database management_system aan

```{=html}
<!-- -->
```
-   Voegt de trigger after_request_insert toe en dit verlaagt
    automatisch de voorraad met het aangevraagde aantal wanneer een
    aanvraag wordt ingediend

```{=html}
<!-- -->
```
-   Voegt de trigger after_shipment_insert toe en dit verhoogt de
    voorraad met 1 per geregistreerde levering, bedoeld voor het scannen
    van individuele items

```{=html}
<!-- -->
```
-   Via de terminal kan dit ook met het volgende commando:

mysql -u \<gebruikersnaam\> -p \< \"DB setup.sql\"

Stap 2: Tabellen aanmaken via Prisma

Voer het volgende commando (Prisma migrate) uit in de terminal vanuit de
backend-map:

npx prisma migrate deploy

Dit past alle migrations toe op de database en maakt de tabellen aan op
basis van het schema in backend/prisma/schema.prisma. De tabellen die
worden aangemaakt zijn: categories, department, items, request,
shipments, suppliers, users, role en reqDescirptions.

### 4.6 Prisma Client genereren

Na het uitvoeren van de migrations moet de Prisma Client worden
gegenereerd. Deze wordt door de applicatie gebruikt om met de database
te communiceren.

Voer het volgende commando uit in de terminal vanuit de backend-map:

npx prisma generate

De gegenereerde bestanden worden opgeslagen in
backend/generated/prisma/.

### 4.7 Applicatie starten

Start de server door het volgende commando uit te voeren in de terminal
vanuit de backend-map:

node server.js

Als de applicatie correct is geconfigureerd, verschijnen de volgende
meldingen in de terminal:

Server running on [http://localhost:5500](http://localhost:3000)

API available at [http://localhost:5500/api](http://localhost:3000/api)

MySQL: Connection established successfully.

De applicatie is nu bereikbaar via de browser op
[http://localhost:5500](http://localhost:3000).

### 4.8 Overzicht van de installatiestappen

  -----------------------------------------------------------------------
  **Stap**                **Commando / Actie**    **Locatie**
  ----------------------- ----------------------- -----------------------
  1                       git clone               Hoofdmap

  2                       npm install             backend/

  3                       Bootstrap 5.3.8         frontend/css/
                          downloaden en plaatsen  

  4                       env-bestand aanmaken en backend/
                          invullen                

  5                       DB setup.sql uitvoeren  MySQL-client

  6                       npx prisma migrate      backend/
                          deploy                  

  7                       npx prisma generate     backend/

  8                       node server.js          backend/
  -----------------------------------------------------------------------
