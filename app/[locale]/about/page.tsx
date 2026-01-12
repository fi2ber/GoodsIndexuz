import type { Locale } from "@/lib/i18n/config";
import { getTranslation } from "@/lib/i18n/translations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    title: t("about.meta.title"),
    description: t("about.meta.description"),
    alternates: {
      canonical: `/${locale}/about`,
    },
  };
}

export default async function AboutPage({
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
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary">{t("about.hero.badge")}</Badge>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{t("about.hero.title")}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{t("about.hero.subtitle")}</p>
        </div>

        {/* Proof points (no invented facts) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("about.proof.trade.title")}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {t("about.proof.trade.description")}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("about.proof.quality.title")}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {t("about.proof.quality.description")}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("about.proof.logistics.title")}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {t("about.proof.logistics.description")}
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Company overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("about.company.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{t("about.company.p1")}</p>
              <p>{t("about.company.p2")}</p>
              <p>{t("about.company.p3")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("about.values.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium">{t("about.values.v1.title")}</p>
                <p className="text-muted-foreground">{t("about.values.v1.description")}</p>
              </div>
              <div>
                <p className="font-medium">{t("about.values.v2.title")}</p>
                <p className="text-muted-foreground">{t("about.values.v2.description")}</p>
              </div>
              <div>
                <p className="font-medium">{t("about.values.v3.title")}</p>
                <p className="text-muted-foreground">{t("about.values.v3.description")}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How we work (trust narrative) */}
        <Card>
          <CardHeader>
            <CardTitle>{t("about.howWeWork.title")}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">{t("about.howWeWork.s1.title")}</p>
              <p className="text-sm text-muted-foreground">{t("about.howWeWork.s1.description")}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">{t("about.howWeWork.s2.title")}</p>
              <p className="text-sm text-muted-foreground">{t("about.howWeWork.s2.description")}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">{t("about.howWeWork.s3.title")}</p>
              <p className="text-sm text-muted-foreground">{t("about.howWeWork.s3.description")}</p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">{t("about.cta.title")}</h2>
          <p className="text-muted-foreground">{t("about.cta.subtitle")}</p>
          <div className="flex items-center justify-center gap-3">
            <a
              href={`/${locale}/products`}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t("about.cta.viewProducts")}
            </a>
            <a
              href={`/${locale}/contact`}
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {t("about.cta.contact")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


