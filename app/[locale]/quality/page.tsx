import type { Locale } from "@/lib/i18n/config";
import { getTranslation } from "@/lib/i18n/translations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = (localeParam === "ru" || localeParam === "en" ? localeParam : "en") as Locale;
  const t = (key: string) => getTranslation(locale, key);

  return {
    title: t("qualityPage.meta.title"),
    description: t("qualityPage.meta.description"),
    alternates: {
      canonical: `/${locale}/quality`,
    },
  };
}

export default async function QualityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = (localeParam === "ru" || localeParam === "en" ? localeParam : "en") as Locale;
  const t = (key: string) => getTranslation(locale, key);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary">{t("qualityPage.hero.badge")}</Badge>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{t("qualityPage.hero.title")}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{t("qualityPage.hero.subtitle")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("qualityPage.system.title")}</CardTitle>
            <CardDescription>{t("qualityPage.system.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium">{t("qualityPage.system.s1.title")}</p>
              <p className="text-muted-foreground">{t("qualityPage.system.s1.description")}</p>
            </div>
            <div>
              <p className="font-medium">{t("qualityPage.system.s2.title")}</p>
              <p className="text-muted-foreground">{t("qualityPage.system.s2.description")}</p>
            </div>
            <div>
              <p className="font-medium">{t("qualityPage.system.s3.title")}</p>
              <p className="text-muted-foreground">{t("qualityPage.system.s3.description")}</p>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("qualityPage.testing.title")}</CardTitle>
              <CardDescription>{t("qualityPage.testing.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{t("qualityPage.testing.p1")}</p>
              <p>{t("qualityPage.testing.p2")}</p>
              <p>{t("qualityPage.testing.p3")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("qualityPage.packaging.title")}</CardTitle>
              <CardDescription>{t("qualityPage.packaging.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{t("qualityPage.packaging.p1")}</p>
              <p>{t("qualityPage.packaging.p2")}</p>
              <p>{t("qualityPage.packaging.p3")}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("qualityPage.guarantees.title")}</CardTitle>
            <CardDescription>{t("qualityPage.guarantees.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium">{t("qualityPage.guarantees.g1.title")}</p>
              <p className="text-muted-foreground">{t("qualityPage.guarantees.g1.description")}</p>
            </div>
            <div>
              <p className="font-medium">{t("qualityPage.guarantees.g2.title")}</p>
              <p className="text-muted-foreground">{t("qualityPage.guarantees.g2.description")}</p>
            </div>
            <div>
              <p className="font-medium">{t("qualityPage.guarantees.g3.title")}</p>
              <p className="text-muted-foreground">{t("qualityPage.guarantees.g3.description")}</p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">{t("qualityPage.cta.title")}</h2>
          <p className="text-muted-foreground">{t("qualityPage.cta.subtitle")}</p>
          <div className="flex items-center justify-center gap-3">
            <a
              href={`/${locale}/certificates`}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t("qualityPage.cta.viewDocs")}
            </a>
            <a
              href={`/${locale}/contact`}
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {t("qualityPage.cta.contact")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


