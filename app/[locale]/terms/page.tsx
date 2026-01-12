import type { Locale } from "@/lib/i18n/config";
import { getTranslation } from "@/lib/i18n/translations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = (localeParam === "ru" || localeParam === "en" ? localeParam : "en") as Locale;
  const t = (key: string) => getTranslation(locale, key);

  return {
    title: t("termsPage.meta.title"),
    description: t("termsPage.meta.description"),
    alternates: {
      canonical: `/${locale}/terms`,
    },
  };
}

export default async function TermsPage({
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
            <Badge variant="secondary">{t("termsPage.hero.badge")}</Badge>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{t("termsPage.hero.title")}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{t("termsPage.hero.subtitle")}</p>
        </div>

        <Alert>
          <AlertTitle>{t("termsPage.disclaimer.title")}</AlertTitle>
          <AlertDescription>{t("termsPage.disclaimer.description")}</AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("termsPage.payment.title")}</CardTitle>
              <CardDescription>{t("termsPage.payment.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>{t("termsPage.payment.p1")}</p>
              <p>{t("termsPage.payment.p2")}</p>
              <p>{t("termsPage.payment.p3")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("termsPage.moq.title")}</CardTitle>
              <CardDescription>{t("termsPage.moq.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>{t("termsPage.moq.p1")}</p>
              <p>{t("termsPage.moq.p2")}</p>
              <p>{t("termsPage.moq.p3")}</p>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("termsPage.delivery.title")}</CardTitle>
              <CardDescription>{t("termsPage.delivery.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>{t("termsPage.delivery.p1")}</p>
              <p>{t("termsPage.delivery.p2")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("termsPage.claims.title")}</CardTitle>
              <CardDescription>{t("termsPage.claims.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>{t("termsPage.claims.p1")}</p>
              <p>{t("termsPage.claims.p2")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("termsPage.legal.title")}</CardTitle>
              <CardDescription>{t("termsPage.legal.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>{t("termsPage.legal.p1")}</p>
              <p>{t("termsPage.legal.p2")}</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">{t("termsPage.cta.title")}</h2>
          <p className="text-muted-foreground">{t("termsPage.cta.subtitle")}</p>
          <div className="flex items-center justify-center gap-3">
            <a
              href={`/${locale}/contact`}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t("termsPage.cta.contact")}
            </a>
            <a
              href={`/${locale}/process`}
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {t("termsPage.cta.viewProcess")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


