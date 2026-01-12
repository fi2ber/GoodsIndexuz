"use client";

import { use } from "react";
import { getTranslation } from "./translations";
import { defaultLocale, type Locale } from "./config";

export function useTranslation(locale: Locale = defaultLocale) {
  return (key: string) => getTranslation(locale, key);
}

