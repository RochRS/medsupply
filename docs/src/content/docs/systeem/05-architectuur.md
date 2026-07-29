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

  ----------------------------------------------------------------------------
  **Onderdeel**           **Technologie**            **Rol**
  ----------------------- -------------------------- -------------------------
  Frontend                HTML5, CSS3, JavaScript    Structuur, styling en
                          (ES6+)                     interactie van de
                                                     pagina\'s

  CSS Framework           Bootstrap 5.3.8            Layout en responsive
                                                     design

  Backend                 Node.js met Express 5      Webserver en REST API

  Database                MySQL via Prisma ORM       Opslag en beheer van alle
                                                     gegevens

  Database-adapter        \@prisma/adapter-mariadb   Verbinding tussen Prisma
                                                     en de database

  Authenticatie           JSON Web Tokens (JWT),     Inlogverificatie en
                          bcrypt                     wachtwoordversleuteling

  Realtime updates        Server-Sent Events (SSE)   Live doorsturen van
                                                     gegevens naar de browser

  Databeveiliging         DOMPurify                  Bescherming van invoer en
                          (isomorphic-dompurify)     uitvoer tegen XSS

  Autorisatie             Rolgebaseerde              Drie niveaus: employee,
                          toegangscontrole           manager, admin

  Configuratie            dotenv                     Laadt environment
                                                     variables uit het
                                                     .env-bestand
  ----------------------------------------------------------------------------

De communicatie tussen frontend en backend verloopt via HTTP-requests
(Fetch API) voor data-uitwisseling en SSE-verbindingen (EventSource)
voor realtime updates.

**5.2 Mappenstructuur en Systeemarchitectuur**\
De mappenstructuur beschrijft hoe alle bestanden en mappen in het
project zijn georganiseerd. Figuur 1 toont een visueel overzicht van de
mappenstructuur. Hieronder wordt per onderdeel toegelicht wat elke map
bevat.

![](/media/image2.png){width="6.260416666666667in"
height="3.0625in"}*Figuur 1: Mappenstructuur*

De backend is opgebouwd volgens een gelaagde structuur, waarbij elke
laag een eigen verantwoordelijkheid heeft. Dit is een gangbaar patroon
voor Express-applicaties. Figuur 2 toont hoe de onderdelen van het
systeem met elkaar communiceren.\
![](/media/image3.png){width="6.260416666666667in"
height="3.0208333333333335in"}*Figuur 2: Systeemarchitectuur dataflow
van frontend naar database*

De frontend is opgebouwd per pagina: elke pagina heeft een eigen HTML-,
CSS- en JavaScript-bestand. De main.css bevat de gedeelde styling die op
alle pagina\'s wordt toegepast. De communicatie tussen frontend en
backend verloopt via HTTP-requests (Fetch API) en SSE-verbindingen
(EventSource), zoals weergegeven in Figuur 2.

### 5.3 Entity Relationship Diagram (ERD)

Een Entity Relationship Diagram (ERD) is een visueel overzicht dat laat
zien welke tabellen er in de database bestaan en hoe ze met elkaar
verbonden zijn. Het databaseschema van de MSMS is gedefinieerd in
backend/prisma/schema.prisma en wordt beheerd via Prisma ORM.

#### 5.3.1 Tabellen

De database management_system bevat negen tabellen. Hieronder staat per
tabel welke kolommen erin zitten en wat de tabel opslaat.

  -----------------------------------------------------------------------
  **Tabel**               **Kolommen**            **Beschrijving**
  ----------------------- ----------------------- -----------------------
  users                   userId (PK), firstName, Bevat de gegevens van
                          lastName, email,        alle geautoriseerde
                          saltedPassword, roleId  gebruikers.
                          (FK), departmentId      
                          (FK), isActive          

  role                    roleId (PK), roleName   Definieert de
                                                  bevoegdheden (bijv.
                                                  employee, manager,
                                                  admin).

  department              departmentId (PK),      De verschillende
                          departmentName          afdelingen binnen het
                                                  St. Vincentius
                                                  Ziekenhuis.

  categories              categoryId (PK),        Groepering van medische
                          categoryName,           middelen.
                          description             

  items                   itemId (PK), itemName,  De centrale catalogus
                          description,            van individuele
                          remainingAmount,        medische artikelen en
                          categoryId (FK)         hun actuele
                                                  voorraadstand.

  request                 requestId (PK),         Aanvragen voor medische
                          requestBatchId, itemId  middelen.
                          (FK), requestedAmount,  
                          isUrgent, isCompleted,  
                          requestedDate, userId   
                          (FK), departmentId (FK) 

  shipments               shipmentId (PK),        Inkomende leveranciers.
                          shipmentBatchId, itemId 
                          (FK), GTIN, supplierId  
                          (FK), deliveryDate,     
                          expirationDate, cost    

  supplier                supplierId (PK),        Leveranciers van
                          supplierName, Address,  medische middelen.
                          Description, contact    

  reqDescriptions         reqDescriptionId (PK),  Beschrijvingsteken bij
                          descriptionField        aanvragen.
  -----------------------------------------------------------------------

Toelichting: PK = Primary Key (unieke identificatie per record), FK =
Foreign Key (verwijzing naar een record in een andere tabel). Elke tabel
bevat daarnaast automatisch een createdAt en updatedAt kolom voor het
bijhouden van aanmaak- en wijzigingstijden.

#### 5.3.2 Relaties tussen tabellen

De tabellen zijn onderling verbonden via foreign keys. Het onderstaande
schema toont hoe de relaties lopen:

![](/media/image4.png){width="6.260416666666667in"
height="3.3229166666666665in"}*Figuur 3: Schema relaties via ForeignKey
(FK)*

Toelichting: A ──\< B betekent dat één record in tabel A gekoppeld kan
zijn aan meerdere records in tabel B. Dit wordt een one-to-many relatie
genoemd.

#### 5.3.3 Triggers

Naast de tabellen bevat de database twee triggers. Een trigger is een
automatische actie die de database uitvoert wanneer er een nieuw record
wordt toegevoegd. De triggers zijn gedefinieerd in DB setup.sql.

+-----------------------+-----------------------+-----------------------+
| **Trigger**           | **Wordt uitgevoerd    | **Actie**             |
|                       | bij**                 |                       |
+=======================+=======================+=======================+
| after_request_insert  | Nieuw record in       | Verlaagt              |
|                       | request               | remainingAmount       |
|                       |                       |                       |
|                       |                       | in items met het      |
|                       |                       | aangevraagde aantal   |
+-----------------------+-----------------------+-----------------------+
| after_shipment_insert | Nieuw record in       | Verhoogt              |
|                       | shipments             | remainingAmount in    |
|                       |                       | items met 1 per       |
|                       |                       | geregistreerde        |
|                       |                       | levering              |
+-----------------------+-----------------------+-----------------------+

Deze triggers zorgen ervoor dat de voorraadaantallen in de items-tabel
automatisch worden bijgewerkt, zonder dat de applicatie dit handmatig
hoeft te doen.
