"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getLocaleFromPath } from "@/lib/i18n/utils";
import { defaultLocale } from "@/lib/i18n/config";

/**
 * Client component that sets the lang attribute on <html> based on the current pathname
 * This allows dynamic lang attribute for locale routes while keeping html/body in root layout
 */
export function LangSetter() {
  const pathname = usePathname();

  useEffect(() => {
    const locale = getLocaleFromPath(pathname) || defaultLocale;
    document.documentElement.lang = locale;
  }, [pathname]);

  return null;
}

