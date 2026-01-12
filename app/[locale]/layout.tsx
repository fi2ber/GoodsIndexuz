import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getLocale } from "@/lib/i18n/server";
import { defaultLocale, locales } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { removeLocaleFromPath } from "@/lib/i18n/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = (localeParam === "ru" || localeParam === "en" ? localeParam : defaultLocale) as Locale;
  
  // Get current URL from headers
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const pathname = headersList.get("x-pathname") || `/${locale}`;
  
  // Remove locale from path to get base path
  const basePath = removeLocaleFromPath(pathname);
  const currentUrl = `${protocol}://${host}${pathname}`;
  
  // Generate alternate links for all locales
  const alternates: { languages: Record<string, string> } = {
    languages: {},
  };
  
  locales.forEach((loc) => {
    // For default locale, use base path without locale prefix
    // For other locales, add locale prefix
    const alternatePath = loc === defaultLocale 
      ? (basePath === "/" ? "/" : basePath)
      : `/${loc}${basePath === "/" ? "" : basePath}`;
    alternates.languages[loc] = `${protocol}://${host}${alternatePath}`;
  });
  
  // x-default should point to default locale version
  const defaultPath = basePath === "/" ? "/" : basePath;
  alternates.languages["x-default"] = `${protocol}://${host}${defaultPath}`;
  
  return {
    alternates,
    other: {
      "canonical": currentUrl,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = (localeParam === "ru" || localeParam === "en" ? localeParam : defaultLocale) as Locale;

  return (
    <SmoothScroll>
      <div className="flex min-h-screen flex-col">
        <Header locale={locale} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} />
      </div>
    </SmoothScroll>
  );
}

