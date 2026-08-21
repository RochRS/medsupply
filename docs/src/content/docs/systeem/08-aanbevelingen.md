---
title: "8. Aanbevelingen"
sidebar:
  order: 8
---

In dit hoofdstuk staan praktische verbeterpunten voor de MSMS. Ze
sluiten rechtstreeks aan op de beperkingen uit hoofdstuk 7. Het gaat dus
niet om nieuwe wensen, maar om realistische vervolgstappen op basis van
de huidige implementatie.

### 8.1 Voorraad en gelijktijdigheid

- Vervang de berekening `voorraad - aangevraagd` in `approveRequest`
  (`api/src/services/requests.service.ts`) door een atomaire
  database-update, bijvoorbeeld `SET remaining_amount =
  remaining_amount - $1 WHERE remaining_amount >= $1`, of gebruik een
  expliciete rijvergrendeling (`SELECT ... FOR UPDATE`) binnen de
  transactie. Zo kan de voorraad nooit negatief worden, ook niet bij
  gelijktijdige goedkeuringen.

### 8.2 Rolcontrole op statistieken en geschiedenis

- Voeg `requireRole(ROLE_NAMES.ADMIN, ROLE_NAMES.APOTHEKER)` toe aan de
  routes in `api/src/routes/statistics.ts` en
  `api/src/routes/history.ts`, zodat de serverkant dezelfde beperking
  afdwingt die de frontend nu alleen visueel toepast.

### 8.3 Inputsanitization consistent toepassen

- Pas de bestaande `validate`-middleware (die `sanitizeDeep` combineert
  met Zod) toe op de actieve routes in plaats van alleen op de
  ongebruikte demo-route, of verwijder die demo-route
  (`api/src/routes/login.ts`) als hij niet meer nodig is.
- Ruim tegelijk het verouderde testbestand op dat naar deze route
  verwijst, zodat er geen dode code blijft hangen die verwarring geeft
  bij toekomstig onderhoud.

### 8.4 Rate limiting toevoegen

- Voeg een rate-limiting-middleware toe voor gevoelige routes zoals
  `/api/auth/sign-in/email` en het aanmaken van gebruikers/aanvragen,
  zodat misbruik en brute-force-aanvallen beperkt worden.

### 8.5 Testsuite herstellen en uitbreiden

- Herstel eerst de Jest-configuratie in `api/` zodat
  `src/test/test.test.ts` (of de vervanging ervan) daadwerkelijk kan
  draaien met de huidige ESM/TypeScript-opzet, en verwijder de
  verwijzing naar de niet meer bestaande `user-info-request`-service.
- Breid daarna de testdekking uit naar de belangrijkste flows: inloggen,
  een aanvraag indienen, goedkeuren/afhandelen en de
  voorraadberekening uit 8.1.
- Voeg minimaal enkele tests toe aan de frontend (`web/`), waar op dit
  moment nog geen testbestanden aanwezig zijn ondanks de geconfigureerde
  Vitest-runner.
