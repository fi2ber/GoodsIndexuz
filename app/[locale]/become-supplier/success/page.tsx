import { Suspense } from "react";
import { SuccessContent } from "./SuccessContent";
import { getTranslation } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/config";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = (localeParam === "ru" || localeParam === "en" ? localeParam : "en") as Locale;
  const t = (key: string) => getTranslation(locale, key);

  return {
    title: `${t("submission.successTitle")} | GoodsIndexuz`,
    description: t("submission.successSubtitle"),
  };
}

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale: localeParam } = await params;
  const { token } = await searchParams;
  const locale = (localeParam === "ru" || localeParam === "en" ? localeParam : "en") as Locale;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
      <Suspense fallback={<div className="flex justify-center py-24"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
        <SuccessContent token={token} locale={locale} />
      </Suspense>
    </div>
  );
}

