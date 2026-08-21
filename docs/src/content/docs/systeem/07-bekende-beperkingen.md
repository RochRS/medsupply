---
title: "7. Bekende beperkingen"
sidebar:
  order: 7
---

In dit hoofdstuk worden de onderdelen beschreven die in de huidige
versie van de MSMS nog niet volledig zijn uitgewerkt, of die merkbare
beperkingen geven in gebruik, beheer of betrouwbaarheid. Deze punten
zijn rechtstreeks afgeleid van de broncode en geven een eerlijk beeld
van wat op dit moment nog niet volledig werkt.

### 7.1 Voorraad en gelijktijdigheid

Bij het goedkeuren van een aanvraag (`approveRequest` in
`api/src/services/requests.service.ts`) wordt binnen één
databasetransactie eerst de actuele voorraad opgevraagd, gecontroleerd
en daarna verlaagd met het aangevraagde aantal. Er wordt echter geen
rijvergrendeling gebruikt (bijvoorbeeld `SELECT ... FOR UPDATE`), en de
nieuwe waarde wordt in de applicatiecode berekend (`voorraad -
aangevraagd`) in plaats van rechtstreeks in de database opgeteld/afgetrokken.
Als twee aanvragen voor hetzelfde artikel vrijwel gelijktijdig worden
goedgekeurd, kan de voorraad in theorie nog steeds verder worden
afgeschreven dan er daadwerkelijk beschikbaar was.

### 7.2 Rolcontrole op statistieken en geschiedenis

De routes `/api/statistics` en `/api/history`
(`api/src/routes/statistics.ts`, `api/src/routes/history.ts`) zijn wel
achter een inlogcontrole geplaatst, maar hebben — in tegenstelling tot
bijvoorbeeld `/api/users` of `/api/notifications` — geen aanvullende
`requireRole`-controle. De frontend verbergt de bijbehorende
menu-items voor de rol verpleging, maar een verpleging-gebruiker die
deze endpoints rechtstreeks aanroept (buiten de gebruikersinterface om)
kan de statistiek- en geschiedenisgegevens toch opvragen.

### 7.3 Inputsanitization wordt niet overal toegepast

Er bestaat een hulpfunctie `sanitizeDeep` (`api/src/lib/sanitize.ts`)
die controletekens en ruwe HTML-tags uit tekstvelden verwijdert, in
combinatie met een `validate`-middleware
(`api/src/middleware/validate.ts`). Deze combinatie wordt op dit moment
alleen daadwerkelijk gebruikt in één demo-route
(`POST /api/login` in `api/src/routes/login.ts`), die overigens nergens
in `api/src/index.ts` wordt aangesloten en dus niet bereikbaar is vanuit
de applicatie. De echte, actieve routes (aanvragen, artikelen,
gebruikers, instellingen, …) valideren wel met Zod-schema's, maar passen
deze extra sanitization-stap niet toe.

### 7.4 Geen rate limiting

Er is geen middleware die het aantal inlogpogingen of API-aanroepen per
gebruiker of IP-adres beperkt. Een geautomatiseerd script zou in de
huidige opzet onbeperkt inlogpogingen kunnen doen op
`/api/auth/sign-in/email`.

### 7.5 Automatische tests draaien momenteel niet

Zowel de backend (Jest) als de frontend (Vitest) hebben een testrunner
geconfigureerd, maar bij het daadwerkelijk uitvoeren van
`pnpm test` in `api/` faalt de volledige testsuite: Jest kan
`src/test/test.test.ts` niet inlezen (`SyntaxError: Cannot use import
statement outside a module`). Dat bestand verwijst bovendien nog naar
een service (`../services/user-info-request.js`) die niet meer bestaat
in de huidige codebase. In `web/` is helemaal geen test-bestand
aanwezig. Er is dus op dit moment geen werkende geautomatiseerde
testdekking voor belangrijke gebruikersflows zoals inloggen, een
aanvraag indienen of goedkeuren.
