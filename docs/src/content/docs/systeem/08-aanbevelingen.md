---
title: "8. Aanbevelingen"
sidebar:
  order: 8
---

In dit hoofdstuk staan praktische verbeterpunten voor de MSMS. Ze
sluiten aan op de beperkingen uit hoofdstuk 7 en op wat er nu al in de
code aanwezig is. Het gaat dus niet om nieuwe wensen, maar om
realistische vervolgstappen op basis van de huidige implementatie.

### 8.1 Inloggen en sessies

Deze paragraaf gaat over het verbeteren van het inlogproces en het
gebruik van sessies.

-   Voeg in authenticateToken.js / routingHub.js de redirect-logica toe
    zodat gebruikers met een geldig token automatisch naar /dashboard
    gaan.

-   Breid de login-validatie in loginController.js uit met controles op
    e‑mailformaat en minimale wachtwoordlengte, zodat ongeldige typen
    invoer worden tegengehouden.

### 8.2 Aanvragen

Hier worden verbeteringen voorgesteld voor het aanvragen van materialen.

-   Activeer en verwerk de extra velden (zoals urgentie en opmerkingen)
    in frontend/javascript/aanvraag.js en in aanvragenController.js,
    zodat alle ingevulde gegevens worden opgeslagen.

-   Pas de aanvraaglogica aan zodat waar nodig een duidelijke itemnaam
    wordt gebruikt in plaats van alleen een id, in lijn met de TODO in
    aanvraag.js.

**8.3 Voorraad en dataconsistentie**\
Deze paragraaf richt zich op het betrouwbaarder maken van de
voorraadgegevens.

-   Implementeer in dashboardController.js en aanvragenController.js een
    extra voorraadcheck vlak vóór het opslaan, en toon een melding als
    de voorraad in de tussentijd is gewijzigd.

-   Onderzoek en los de beschreven race condition op (bijvoorbeeld door
    transacties of lock-mechanismen te gebruiken), zodat gelijktijdige
    aanvragen de voorraad niet inconsistent maken.

**8.4 Statistieken**\
Deze paragraaf gaat over het efficiënter en stabieler maken van het
ophalen en tonen van statistieken.

-   Vervang de SSE-aanpak voor statistieken door een periodieke taak
    (bijvoorbeeld een cronjob) die de statistieken berekent en opslaat
    in de database, zodat de frontend de statistieken via normale
    API-calls kan ophalen. Dit sluit aan op de huidige SSE-implementatie
    in backend/api/controller/statistiekenController.js en de opmerking
    in backend/routingHub.js dat SSE voor statistieken
    resource-intensief is.

-   Leg de datalimieten voor statistieken duidelijk vast en maak ze
    consistent in de backend. In
    backend/api/controller/statistiekenController.js wordt
    req.query.limit nu ingeperkt tot een veilige range (1--100).

### 8.5 Geschiedenis

Deze paragraaf gaat over het bruikbaarder maken van het
geschiedenis-overzicht.

-   Deze paragraaf gaat over het verbeteren van het vernieuwen en
    filteren van het geschiedenis-overzicht. (In
    frontend/javascript/geschiedenis.js staan de addEventListener-regels
    voor de filters uitgeschakeld.)

-   Verhoog het refresh-interval voor de geschiedenispagina door
    STANDARD_DASHBOARD aan te passen. In
    backend/api/controller/geschiedenisController.js wordt de
    setInterval voor de SSE-verversing ingesteld met
    REFRESH_RATES.STANDARD_DASHBOARD, terwijl in
    backend/api/utils/magicNumberFile.js staat dat dit eigenlijk naar
    10\**60\**1000 moet.

### 8.6 Configuratie en beheerbaarheid

Deze paragraaf gaat over het verbeteren van het vernieuwen en filteren
van het geschiedenis-overzicht.

-   Definieer de drempel voor lage/kritieke voorraad op één centrale
    plek (bijvoorbeeld alleen in magicNumberFile.js of in de database)
    en laat de frontend deze via een API ophalen, zodat backend en
    frontend dezelfde grens gebruiken.

-   Verplaats belangrijke limieten (zoals maximale aantallen en
    standaard limit waarden) naar configuratie via
    environment-variabelen of een aparte config-file, in plaats van
    vaste waarden in de code.

### 8.7 Beveiliging

Dit onderdeel geeft verbeteringen voor de beveiliging van de applicatie,
in lijn met de Web Security- en Auth & Authorization-richtlijnen.

-   Beperk CORS in server.js tot expliciete toegestane origins
    (bijvoorbeeld de frontend-URL) in plaats van een volledig open
    cors().

-   Activeer in api/utils/config.js de cookie-opties httpOnly, sameSite
    en secure (ten minste in productie), zodat tokens beter beschermd
    zijn.

-   Voeg een rate-limiting middleware toe voor gevoelige routes zoals
    login en aanvragen, zodat misbruik en brute-force aanvallen worden
    beperkt.
