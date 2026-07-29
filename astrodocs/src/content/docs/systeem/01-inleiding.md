---
title: "1. Inleiding"
sidebar:
  order: 1
---

Deze systeemhandleiding beschrijft de technische opbouw, installatie en
configuratie van de MedSupply Manager System (MSMS). Dit systeem is
ontwikkeld voor het St. Vincentius Ziekenhuis (RKZ) in Paramaribo, als
onderdeel van een schoolopdracht voor de opleiding Software Engineering
aan UNASAT.

### 1.1 Achtergrond

Binnen het RKZ verloopt de afstemming over medische voorraden
grotendeels via de telefoon. In een ziekenhuisomgeving waar snel
handelen essentieel is, leidt dit tot vertragingen en miscommunicatie.
De MSMS is ontworpen als een digitaal platform dat afdelingen realtime
inzicht geeft in de beschikbaarheid van medische middelen, zodat
telefonisch contact niet meer nodig is voor voorraadverzoeken.

### 1.2 Doelgroep van deze handleiding

Deze handleiding is bedoeld voor ontwikkelaars, systeembeheerders en
technisch specialisten die verantwoordelijk zijn voor het installeren,
configureren en onderhouden van de MSMS. Voor het dagelijks gebruik van
de applicatie op de werkvloer verwijzen wij naar de
gebruikershandleiding.

### 1.3 Gebruikte technologieën

  ---------------- ------------------------------------------------------
  **Onderdeel**    **Technologie**

  Frontend         HTML, CSS, JavaScript, Bootstrap 5

  Backend          Node.js met Express

  Database         MySQL beheerd via Prisma ORM

  Authenticatie    JSON Web Tokens (JWT) met bcrypt

  Realtime updates Server-Sent Events (SSE)

  Beveiliging      DOMPurify voor invoer- en uitvoerbeveiliging en
                   rolgebaseerde toegangscontrole
  ---------------- ------------------------------------------------------

### 1.4 Leeswijzer

In de volgende hoofdstukken wordt stap voor stap behandeld hoe het
systeem is opgebouwd, hoe het geïnstalleerd wordt en welke configuratie
nodig is om de applicatie draaiend te krijgen.

*Let op: De MSMS is ontwikkeld als schoolproject. Niet alle
functionaliteiten zijn volledig afgerond. Waar dit het geval is, wordt
dat in de betreffende hoofdstukken aangegeven.*
