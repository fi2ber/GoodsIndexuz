import { defaultLocale, locales, type Locale } from "./config";

/**
 * Detects preferred locale from Accept-Language header
 * Priority: ru > en (for Uzbek users who often have ru in their browser)
 * Falls back to defaultLocale if no match found
 */
export function detectLocaleFromAcceptLanguage(
  acceptLanguage: string | null
): Locale {
  if (!acceptLanguage) {
    return defaultLocale;
  }

  // Parse Accept-Language header (format: "en-US,en;q=0.9,ru;q=0.8")
  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const [code, q = "q=1"] = lang.trim().split(";");
      const quality = parseFloat(q.replace("q=", "")) || 1;
      return {
        code: code.toLowerCase().split("-")[0], // Extract base language (en from en-US)
        quality,
      };
    })
    .sort((a, b) => b.quality - a.quality); // Sort by quality

  // Check for supported locales in order of preference
  for (const lang of languages) {
    if (locales.includes(lang.code as Locale)) {
      return lang.code as Locale;
    }
  }

  return defaultLocale;
}

/**
 * Extracts locale from pathname
 * Returns locale if path starts with /ru/ or /en/, null otherwise
 */
export function getLocaleFromPath(pathname: string): Locale | null {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale;
  }

  return null;
}

/**
 * Normalizes path by ensuring it has a locale prefix
 * If path already has a locale, returns it as-is
 * Otherwise, prepends the locale
 */
export function normalizePath(pathname: string, locale: Locale): string {
  // Remove leading slash for processing
  const cleanPath = pathname.startsWith("/") ? pathname.slice(1) : pathname;

  // If path already starts with a locale, replace it
  const existingLocale = getLocaleFromPath(pathname);
  if (existingLocale) {
    const pathWithoutLocale = cleanPath.replace(/^[^/]+/, "");
    return `/${locale}${pathWithoutLocale ? `/${pathWithoutLocale}` : ""}`;
  }

  // If path is empty or just "/", return locale root
  if (!cleanPath || cleanPath === "/") {
    return `/${locale}`;
  }

  // Prepend locale
  return `/${locale}/${cleanPath}`;
}

/**
 * Removes locale from pathname
 * /ru/products -> /products
 * /en -> /
 */
export function removeLocaleFromPath(pathname: string): string {
  const locale = getLocaleFromPath(pathname);
  if (!locale) {
    return pathname;
  }

  const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
  return pathWithoutLocale;
}

