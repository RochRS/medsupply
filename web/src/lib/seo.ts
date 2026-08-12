/** Default and per-route SEO for the MedSupply SPA. */

export type PageSeo = {
  title: string;
  description: string;
  /** When true, discourage indexing (authenticated app pages). */
  noIndex?: boolean;
};

export const SITE_NAME = "MedSupply";
export const SITE_LOGO_PATH = "/images/rkz-logo.png";
export const DEFAULT_DESCRIPTION =
  "MedSupply — voorraadbeheer voor medische supplies van St. Vincentius Ziekenhuis (RKZ). Aanvragen, goedkeuren en voorraad bijhouden.";

const PAGE_SEO: Record<string, PageSeo> = {
  "/": {
    title: "Inloggen",
    description:
      "Log in op MedSupply met je ziekenhuisaccount om voorraad en aanvragen te beheren.",
  },
  "/dashboard": {
    title: "Dashboard",
    description: "Overzicht van spoedaanvragen, voorraadstatus en meldingen.",
    noIndex: true,
  },
  "/inventory": {
    title: "Voorraad",
    description: "Bekijk en beheer de totale voorraad van medische supplies.",
    noIndex: true,
  },
  "/request": {
    title: "Aanvraag mand",
    description: "Stel een aanvraag samen en verstuur die naar de apotheek.",
    noIndex: true,
  },
  "/aanvragen": {
    title: "Aanvragen",
    description: "Bekijk, keur goed en handel openstaande aanvragen af.",
    noIndex: true,
  },
  "/mijn-aanvragen": {
    title: "Mijn aanvragen",
    description: "Volg de status van je eigen supply-aanvragen.",
    noIndex: true,
  },
  "/statistics": {
    title: "Statistieken",
    description: "Inzichten in voorraadgebruik, categorieën en opslagtijd.",
    noIndex: true,
  },
  "/history": {
    title: "Geschiedenis",
    description: "Historisch overzicht van aanvragen en leveringen.",
    noIndex: true,
  },
  "/admin": {
    title: "Gebruikers",
    description: "Beheer gebruikersaccounts, rollen en wachtwoorden.",
    noIndex: true,
  },
  "/profiel": {
    title: "Profiel",
    description: "Bekijk en beheer je accountgegevens.",
    noIndex: true,
  },
  "/settings": {
    title: "Instellingen",
    description: "Applicatie-instellingen voor MedSupply.",
    noIndex: true,
  },
  "/change-password": {
    title: "Wachtwoord wijzigen",
    description: "Stel een nieuw wachtwoord in voor je MedSupply-account.",
    noIndex: true,
  },
};

export function getPageSeo(pathname: string): PageSeo {
  return (
    PAGE_SEO[pathname] ?? {
      title: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
      noIndex: true,
    }
  );
}

export function formatDocumentTitle(pageTitle: string): string {
  if (!pageTitle || pageTitle === SITE_NAME) return SITE_NAME;
  return `${pageTitle} | ${SITE_NAME}`;
}

function upsertMeta(
  attr: "name" | "property",
  key: string,
  content: string,
): void {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

/** Apply document title + meta tags for the current SPA route. */
export function applyDocumentSeo(pathname: string, origin?: string): void {
  const page = getPageSeo(pathname);
  const title = formatDocumentTitle(page.title);
  const description = page.description;
  const siteOrigin =
    origin?.replace(/\/$/, "") ??
    (typeof window !== "undefined" ? window.location.origin : undefined);
  const url =
    siteOrigin != null
      ? `${siteOrigin}${pathname === "/" ? "" : pathname}`
      : typeof window !== "undefined"
        ? window.location.href.split("?")[0]
        : undefined;
  const imageUrl = siteOrigin
    ? `${siteOrigin}${SITE_LOGO_PATH}`
    : SITE_LOGO_PATH;

  document.title = title;
  upsertMeta("name", "description", description);
  upsertMeta(
    "name",
    "robots",
    page.noIndex ? "noindex, nofollow" : "index, follow",
  );

  upsertMeta("property", "og:type", "website");
  upsertMeta("property", "og:site_name", SITE_NAME);
  upsertMeta("property", "og:title", title);
  upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:image", imageUrl);
  if (url) upsertMeta("property", "og:url", url);
  upsertMeta("property", "og:locale", "nl_NL");

  upsertMeta("name", "twitter:card", "summary");
  upsertMeta("name", "twitter:title", title);
  upsertMeta("name", "twitter:description", description);
  upsertMeta("name", "twitter:image", imageUrl);

  if (url) upsertLink("canonical", url);
}
