# MedSupply Documentation — README

Deze site is gemaakt met [Astro](https://astro.build) + [Starlight](https://starlight.astro.build). Dit document legt uit hoe je de inhoud en het menu aanpast, en hoe je het project lokaal opstart.

## Project starten (dev mode)

Open een terminal in de projectmap en run:

```bash
npm run dev
```

Open daarna in je browser: `http://localhost:4321`

De site herlaadt automatisch zodra je een bestand opslaat — je hoeft de server niet opnieuw te starten na een tekstwijziging.

## Inhoud aanpassen

Alle pagina's zijn gewone Markdown-bestanden (`.md`). Je kunt ze direct openen en bewerken in Cursor (of elke teksteditor).

### Gebruikershandleiding

Locatie: `src/content/docs/gebruikers/`

Elk bestand is één pagina, bijvoorbeeld:
- `01-inleiding.md`
- `02-wat-is-medsupply-managersystem.md`
- `03-inloggen.md`
- ...enzovoort

Bovenaan elk bestand staat een "frontmatter"-blok tussen `---` lijnen:

```markdown
---
title: "Inloggen"
sidebar:
  order: 3
---
```

- `title` is de titel die bovenaan de pagina en in het menu verschijnt.
- `sidebar: order:` bepaalt de volgorde in het menu (lager nummer = hoger in de lijst).

Alles ná de tweede `---` is de eigenlijke inhoud, in gewone Markdown:
- `**vet**` voor vetgedrukte tekst
- `- item` voor een bullet-lijst
- `## Kop` voor een subkop

### Systeemhandleiding

Locatie: `src/content/docs/systeem/`

Werkt op exact dezelfde manier als de Gebruikershandleiding — elk bestand is één pagina met dezelfde frontmatter-structuur (`title` + `sidebar: order:`).

## Een nieuwe pagina toevoegen

1. Maak een nieuw `.md` bestand aan in `src/content/docs/gebruikers/` of `src/content/docs/systeem/`.
2. Zet er frontmatter bovenaan (kopieer die van een bestaand bestand als voorbeeld).
3. Voeg de pagina toe aan het menu — zie hieronder.

## Het menu (sidebar) aanpassen

Het menu wordt **niet automatisch** gegenereerd — het staat expliciet in `astro.config.mjs`, in het `sidebar:`-blok.

Om een pagina toe te voegen, verwijderen, of de volgorde te wijzigen, pas je de lijst aan onder `Gebruikershandleiding` of `Systeemhandleiding`:

```js
{
    label: 'Gebruikershandleiding',
    items: [
        { label: 'Inleiding', slug: 'gebruikers/01-inleiding' },
        { label: 'Inloggen', slug: 'gebruikers/03-inloggen' },
        // ...
    ],
},
```

- `label` is de tekst die in het menu wordt getoond.
- `slug` is het bestandspad **zonder** `.md` extensie (bijvoorbeeld `gebruikers/03-inloggen` voor `src/content/docs/gebruikers/03-inloggen.md`).

Om een pagina te verwijderen uit het menu: verwijder de bijbehorende regel. Om de volgorde te wijzigen: verplaats de regel naar de gewenste positie in de lijst.

Sla `astro.config.mjs` op — de dev server pikt de wijziging automatisch op.

## Website live zetten (production)

```bash
npm run build
```

Dit genereert een kant-en-klare statische site in de map `dist/`. Die map kun je uploaden naar elke webhost (Netlify, Vercel, GitHub Pages, etc.).

Om de gebouwde versie lokaal te testen vóór het live zetten:

```bash
npm run preview
```
