import { useEffect } from "react";
import { applyDocumentSeo, SITE_NAME } from "./seo";

/** Keeps document title and meta tags in sync with the current route. */
export function useDocumentSeo(pathname: string, siteName: string = SITE_NAME) {
  useEffect(() => {
    applyDocumentSeo(pathname, siteName);
  }, [pathname, siteName]);
}
