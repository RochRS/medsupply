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

| Onderdeel | Technologie |
|-----------|-------------|
| Frontend | React 19 + TypeScript (Single Page Application), gebouwd met Vite, TanStack Router/Query en Tailwind CSS |
| Backend | Node.js met Hono |
| Database | PostgreSQL, beheerd via Drizzle ORM |
| Authenticatie | Better Auth (sessie-cookies, met ingebouwde wachtwoordversleuteling) |
| Updates | Periodiek ophalen (polling) van bijvoorbeeld meldingen, geen permanente serververbinding |
| Beveiliging | Rolgebaseerde toegangscontrole (admin, apotheker, verpleging), afgedwongen in de API |

### 1.4 Leeswijzer

In de volgende hoofdstukken wordt stap voor stap behandeld hoe het
systeem is opgebouwd, hoe het geïnstalleerd wordt en welke configuratie
nodig is om de applicatie draaiend te krijgen.

*Let op: De MSMS is ontwikkeld als schoolproject. Niet alle
functionaliteiten zijn volledig afgerond. Waar dit het geval is, wordt
dat in de betreffende hoofdstukken aangegeven.*
