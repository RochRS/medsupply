import { useEffect } from "react";
import { applyDocumentSeo } from "./seo";

/** Keeps document title and meta tags in sync with the current route. */
export function useDocumentSeo(pathname: string) {
  useEffect(() => {
    applyDocumentSeo(pathname);
  }, [pathname]);
}
