---
title: "2. Systeemoverzicht"
sidebar:
  order: 2
---

Dit hoofdstuk beschrijft hoe de verschillende onderdelen van de MSMS
samenwerken. Het geeft inzicht in de technische opbouw, de manier waarop
gegevens worden verwerkt en hoe de database is ingericht.

### 2.1 Technische opbouw

De MSMS is gebouwd als één samenhangende Node.js-webapplicatie. De kern
is een Express-server die twee taken vervult:

API-server: verwerkt gegevensverzoeken via REST-endpoints en verzorgt
realtime updates via Server-Sent Events (SSE).

Webserver: levert de frontend-bestanden (HTML, CSS, JavaScript) aan de
browser van de gebruiker.

De communicatie tussen de frontend (waarmee de medewerker werkt) en de
backend (waar de gegevens worden verwerkt) verloopt via HTTP-verzoeken
(Fetch API) en SSE-verbindingen (EventSource).

### 2.2 Verwerking van gegevensstromen

De applicatie verwerkt drie soorten verkeer:

Pagina-verzoeken Wanneer een gebruiker een pagina opvraagt, controleert
de server eerst of de gebruiker is ingelogd en of die toegang heeft tot
de gevraagde pagina. Pas daarna wordt het juiste HTML-bestand verzonden
via de viewHelper-module.

API-verzoeken Wanneer er gegevens worden verstuurd, bijvoorbeeld bij het
indienen van een voorraadaanvraag, stuurt de frontend JSON-data naar een
API-endpoint. De server verwerkt dit via de controller- en servicelaag
en stuurt een resultaat (JSON) terug.

SSE-streams (realtime updates) Om afdelingen direct op de hoogte te
houden van wijzigingen, opent de frontend een langlopende verbinding met
de server. De server stuurt vervolgens op vaste intervallen de meest
actuele gegevens vanuit de database naar de browser. De gebruiker hoeft
de pagina niet handmatig te vernieuwen om de laatste voorraadstatus te
zien.

### 2.3 Database

Alle gegevens worden centraal opgeslagen in een MySQL-database. De
applicatie communiceert met deze database via Prisma ORM, een hulpmiddel
dat het schrijven van databaseverzoeken vereenvoudigt en helpt om fouten
in de code te voorkomen. Hierbij wordt gebruikgemaakt van de
MariaDB-adapter (@prisma/adapter-mariadb) voor de databaseverbinding.
