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
    title: t("logisticsPage.meta.title"),
    description: t("logisticsPage.meta.description"),
    alternates: {
      canonical: `/${locale}/logistics`,
    },
  };
}

export default async function LogisticsPage({
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
            <Badge variant="secondary">{t("logisticsPage.hero.badge")}</Badge>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{t("logisticsPage.hero.title")}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{t("logisticsPage.hero.subtitle")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("logisticsPage.modes.title")}</CardTitle>
            <CardDescription>{t("logisticsPage.modes.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium">{t("logisticsPage.modes.m1.title")}</p>
              <p className="text-muted-foreground">{t("logisticsPage.modes.m1.description")}</p>
            </div>
            <div>
              <p className="font-medium">{t("logisticsPage.modes.m2.title")}</p>
              <p className="text-muted-foreground">{t("logisticsPage.modes.m2.description")}</p>
            </div>
            <div>
              <p className="font-medium">{t("logisticsPage.modes.m3.title")}</p>
              <p className="text-muted-foreground">{t("logisticsPage.modes.m3.description")}</p>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("logisticsPage.incoterms.title")}</CardTitle>
              <CardDescription>{t("logisticsPage.incoterms.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{t("logisticsPage.incoterms.p1")}</p>
              <p>{t("logisticsPage.incoterms.p2")}</p>
              <p>{t("logisticsPage.incoterms.p3")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("logisticsPage.docs.title")}</CardTitle>
              <CardDescription>{t("logisticsPage.docs.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{t("logisticsPage.docs.p1")}</p>
              <p>{t("logisticsPage.docs.p2")}</p>
              <p>{t("logisticsPage.docs.p3")}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("logisticsPage.packaging.title")}</CardTitle>
            <CardDescription>{t("logisticsPage.packaging.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium">{t("logisticsPage.packaging.p1.title")}</p>
              <p className="text-muted-foreground">{t("logisticsPage.packaging.p1.description")}</p>
            </div>
            <div>
              <p className="font-medium">{t("logisticsPage.packaging.p2.title")}</p>
              <p className="text-muted-foreground">{t("logisticsPage.packaging.p2.description")}</p>
            </div>
            <div>
              <p className="font-medium">{t("logisticsPage.packaging.p3.title")}</p>
              <p className="text-muted-foreground">{t("logisticsPage.packaging.p3.description")}</p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">{t("logisticsPage.cta.title")}</h2>
          <p className="text-muted-foreground">{t("logisticsPage.cta.subtitle")}</p>
          <div className="flex items-center justify-center gap-3">
            <a
              href={`/${locale}/contact`}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t("logisticsPage.cta.contact")}
            </a>
            <a
              href={`/${locale}/process`}
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {t("logisticsPage.cta.viewProcess")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


