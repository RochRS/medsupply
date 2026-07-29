---
title: "7. Bekende beperkingen"
sidebar:
  order: 7
---

In dit hoofdstuk worden de onderdelen beschreven die in de huidige
versie van de MSMS nog niet volledig zijn uitgewerkt, of die merkbare
beperkingen geven in gebruik, beheer of betrouwbaarheid. Deze punten
zijn rechtstreeks afgeleid van de broncode (zoals TODO‑commentaar,
waarschuwingen en uitgeschakelde functionaliteit) en geven een eerlijk
beeld van wat op dit moment nog niet volledig werkt.

### 7.1 Inloggen en sessies

Deze paragraaf gaat over beperkingen in het inlogproces en het bewaren
van sessies.

-   De applicatie stuurt gebruikers met een al geldig token niet
    automatisch naar het dashboard, omdat de redirect-logica in
    authenticateToken.js / routingHub.js nog als TODO staat.

-   De login-validatie controleert nu vooral of velden zijn ingevuld,
    omdat in loginController.js nog geen controle op type en formaat
    (zoals e‑mailpatroon) is uitgewerkt.

### 7.2 Aanvragen

Hier worden de beperkingen rond het aanvragen van materialen beschreven.

-   Niet alle velden van het aanvraagformulier (zoals urgentie en
    opmerkingen) worden opgeslagen, omdat de bijbehorende velden en
    logica in frontend/javascript/aanvraag.js (deels) uitgeschakeld
    zijn.

-   Op sommige plekken wordt een item-id gebruikt waar een itemnaam
    bedoeld is, omdat in frontend/javascript/aanvraag.js tijdelijk voor
    id is gekozen (TODO in de code).

### 7.3 Voorraad en dataconsistentie

Deze paragraaf gaat over situaties waarin de getoonde voorraad tijdelijk
kan afwijken van de werkelijkheid.

-   De voorraad kan tijdelijk onjuist lijken als meerdere gebruikers
    tegelijk hetzelfde item aanvragen, omdat in dashboardController.js
    en aanvragenController.js nog geen oplossing is geïmplementeerd voor
    de beschreven race condition.

-   Vlak vóór het opslaan van een aanvraag wordt de actuele voorraad
    niet opnieuw gecontroleerd, omdat de extra stock-check in beide
    controllers alleen als TODO in de code staat.

### 7.4 Statistieken

Hier worden beperkingen beschreven die te maken hebben met het ophalen
en tonen van statistieken.

-   Statistieken worden nu opgehaald via een SSE-stream (live
    verbinding). In statistiekenController.js loopt dit met setInterval
    en REFRESH_RATES.SYSTEM_STATUS, terwijl in routingHub.js staat dat
    SSE voor statistieken resource-intensief is en dat dit beter
    periodiek verwerkt kan worden in plaats van continu via SSE.

-   De hoeveelheid data die tegelijk wordt opgevraagd is beperkt. In
    statistiekenController.js wordt req.query.limit ingeperkt tot een
    waarde tussen 1 en 100, en er staat een opmerking dat het mogelijk
    nog te ruim kan zijn ("Maybe is allowing all the data to be shown").

### 7.5 Geschiedenis

Hier worden beperkingen beschreven die te maken hebben met het
vernieuwen en filteren van de geschiedenis.

-   De geschiedenispagina wordt op dit moment mogelijk te vaak ververst.
    In geschiedenisController.js wordt het vernieuwen gedaan met
    REFRESH_RATES.STANDARD_DASHBOARD, terwijl magicNumberFile.js
    aangeeft dat STANDARD_DASHBOARD nu op 5000 ms staat en dat dit
    eigenlijk naar 10\**60\**1000 moet.

-   Filters op de geschiedenispagina zijn nog niet volledig actief. In
    frontend/javascript/geschiedenis.js staan de addEventListener-regels
    voor periodeFilter en typeFilter uitgeschakeld (gecommentarieerd),
    waardoor de filters mogelijk niet reageren zoals bedoeld.

### 7.6 Configuratie en vaste waarden

Hier worden beperkingen beschreven die te maken hebben met instellingen
die nu vast in de code staan.

-   De definitie van lage/kritieke voorraad is niet overal hetzelfde,
    omdat de backend REMAINING_AMOUNT = 25 gebruikt
    (magicNumberFile.js), terwijl de frontend andere drempels (zoals 50
    en 100) hanteert in totaleVoorraad.js.

-   Diverse limieten (zoals maximale aantallen records en
    refresh-intervallen) zijn hardcoded, omdat deze waarden direct in
    magicNumberFile.js en enkele controllers/services zijn vastgezet in
    plaats van via configuratie.

### 7.7 Beveiliging (samenvatting)

Dit onderdeel vat de belangrijkste beveiligingsbeperkingen samen die al
zijn beschreven in hoofdstuk 6.

-   CORS staat te ruim open, omdat in server.js cors() zonder
    beperkingen wordt aangeroepen.

-   Cookie-beveiliging is deels uitgeschakeld, omdat httpOnly, sameSite
    en secure in api/utils/config.js zijn uitgecommentarieerd.

-   Rate limiting ontbreekt, omdat in server.js alleen een opmerking
    staat over rate limiting, zonder daadwerkelijke implementatie.
