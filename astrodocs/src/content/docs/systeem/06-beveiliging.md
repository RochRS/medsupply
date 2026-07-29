---
title: "6. Beveiliging"
sidebar:
  order: 6
---

Dit hoofdstuk beschrijft welke beveiligingsmaatregelen in de MSMS zijn
geïmplementeerd. De beveiliging bestaat uit drie lagen: authenticatie
(wie ben je?), autorisatie (wat mag je?) en databeveiliging (is de data
veilig?).

### 6.1 Authenticatie

Authenticatie is het proces waarbij het systeem controleert of een
gebruiker is wie die zegt te zijn. De MSMS gebruikt hiervoor JSON Web
Tokens (JWT) en bcrypt.

#### 6.1.1 Inlogproces

Wanneer een gebruiker inlogt, doorloopt het systeem de volgende stappen:

-   De gebruiker vult een e-mailadres, wachtwoord en rol in op het
    inlogscherm

```{=html}
<!-- -->
```
-   De server ontvangt deze gegevens via de loginController

```{=html}
<!-- -->
```
-   Het wachtwoord wordt vergeleken met het versleutelde wachtwoord in
    de database via bcrypt.compare()

```{=html}
<!-- -->
```
-   Er wordt gecontroleerd of het account actief is (isActive)

```{=html}
<!-- -->
```
-   Bij succes wordt een JWT-token aangemaakt met daarin: userId,
    userRoleName, userDepartmentName en een uniek jti (token-ID)

```{=html}
<!-- -->
```
-   Het token verloopt na 1 uur en wordt opgeslagen als cookie in de
    browser

#### 6.1.2 Tokenverificatie

Bij elk beveiligd verzoek controleert de authenticateToken-middleware
het volgende:

-   Is er een token aanwezig in de cookies?

```{=html}
<!-- -->
```
-   Is het token geldig en niet verlopen?

```{=html}
<!-- -->
```
-   Komt de informatie in het token overeen met de database (rol,
    afdeling, actief)?

Als een van deze controles faalt, wordt de cookie verwijderd en wordt de
gebruiker teruggestuurd naar het inlogscherm.

### 6.2 Autorisatie (rolgebaseerde toegangscontrole)

Autorisatie bepaalt wat een ingelogde gebruiker mag doen. De MSMS
gebruikt drie toegangsniveaus:

  -----------------------------------------------------------------------
  **Niveau**              **Rol**                 **Waarde**
  ----------------------- ----------------------- -----------------------
  1                       Employee                Laagste toegang

  2                       Manager                 Middenniveau

  3                       Admin                   Hoogste toegang
  -----------------------------------------------------------------------

De getUserAuthorizationLevel-middleware controleert bij elk verzoek of
het toegangsniveau van de gebruiker hoog genoeg is voor de gevraagde
pagina of API-route.

#### 6.2.1 Toegangsrechten per pagina en API-route

  -----------------------------------------------------------------------
  **Pagina/Route**                    **Minimaal niveau**
  ----------------------------------- -----------------------------------
  /dashboard, /aanvraag,              Employee (1)
  /totale-voorraad, /profile,         
  /settings                           

  /statistieken                       Manager (2)

  /geschiedenis                       Admin (3)

  /login, /                           Geen (openbaar)
  -----------------------------------------------------------------------

Als een gebruiker met een te laag niveau een pagina probeert te openen,
wordt die teruggestuurd naar het dashboard met een foutmelding.

### 6.3 Databeveiliging (XSS-preventie)

Cross-Site Scripting (XSS) is een aanval waarbij schadelijke code wordt
ingevoegd via invoervelden. De MSMS beschermt hiertegen op twee plekken,
beide via de package isomorphic-dompurify (DOMPurify):

1.  Invoerbeveiliging: alle inkomende data (req.body, req.query,
    req.params) wordt automatisch opgeschoond voordat het de controllers
    bereikt. Schadelijke HTML- of scripttags worden verwijderd.

2.  Uitvoerbeveiliging: alle uitgaande data wordt opgeschoond voordat
    het naar de browser wordt gestuurd. Dit geldt voor reguliere
    JSON-responses en SSE-streams. Beide sanitizers worden globaal
    toegepast in routingHub.js, waardoor ze automatisch actief zijn op
    alle routes.

### 6.4 Overige beveiligingsmaatregelen

  -----------------------------------------------------------------------
  **Maatregel**           **Status**              **Toelichting**
  ----------------------- ----------------------- -----------------------
  CORS                    Ingeschakeld            Staat momenteel alle
                                                  bronnen toe, zonder
                                                  specifieke configuratie

  Cookie-instellingen     Gedeeltelijk            httpOnly, sameSite en
                                                  secure zijn aanwezig in
                                                  de code maar staan
                                                  uitgeschakeld

  Rate limiting           Niet geïmplementeerd    Staat als opmerking in
                                                  de code maar is niet
                                                  ingebouwd

  Wachtwoord-hashing      Niet in de codebase     bcrypt.compare() wordt
  (aanmaken)                                      gebruikt voor login,
                                                  maar bcrypt.hash() voor
                                                  het aanmaken van nieuwe
                                                  wachtwoorden is niet
                                                  aanwezig
  -----------------------------------------------------------------------
