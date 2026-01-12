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
    title: t("processPage.meta.title"),
    description: t("processPage.meta.description"),
    alternates: {
      canonical: `/${locale}/process`,
    },
  };
}

export default async function ProcessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = (localeParam === "ru" || localeParam === "en" ? localeParam : "en") as Locale;
  const t = (key: string) => getTranslation(locale, key);

  const steps = [
    { k: "s1", n: "01" },
    { k: "s2", n: "02" },
    { k: "s3", n: "03" },
    { k: "s4", n: "04" },
    { k: "s5", n: "05" },
    { k: "s6", n: "06" },
    { k: "s7", n: "07" },
  ] as const;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary">{t("processPage.hero.badge")}</Badge>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{t("processPage.hero.title")}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t("processPage.hero.subtitle")}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("processPage.overview.title")}</CardTitle>
            <CardDescription>{t("processPage.overview.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">{t("processPage.overview.p1.title")}</p>
              <p className="text-sm text-muted-foreground">{t("processPage.overview.p1.description")}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">{t("processPage.overview.p2.title")}</p>
              <p className="text-sm text-muted-foreground">{t("processPage.overview.p2.description")}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">{t("processPage.overview.p3.title")}</p>
              <p className="text-sm text-muted-foreground">{t("processPage.overview.p3.description")}</p>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="grid grid-cols-1 gap-4">
          {steps.map((s) => (
            <Card key={s.k}>
              <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{t(`processPage.steps.${s.k}.title`)}</CardTitle>
                  <CardDescription>{t(`processPage.steps.${s.k}.subtitle`)}</CardDescription>
                </div>
                <Badge variant="outline">{s.n}</Badge>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>{t(`processPage.steps.${s.k}.p1`)}</p>
                <p>{t(`processPage.steps.${s.k}.p2`)}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("processPage.requirements.title")}</CardTitle>
            <CardDescription>{t("processPage.requirements.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium">{t("processPage.requirements.r1.title")}</p>
              <p className="text-muted-foreground">{t("processPage.requirements.r1.description")}</p>
            </div>
            <div>
              <p className="font-medium">{t("processPage.requirements.r2.title")}</p>
              <p className="text-muted-foreground">{t("processPage.requirements.r2.description")}</p>
            </div>
            <div>
              <p className="font-medium">{t("processPage.requirements.r3.title")}</p>
              <p className="text-muted-foreground">{t("processPage.requirements.r3.description")}</p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">{t("processPage.cta.title")}</h2>
          <p className="text-muted-foreground">{t("processPage.cta.subtitle")}</p>
          <div className="flex items-center justify-center gap-3">
            <a
              href={`/${locale}/contact`}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t("processPage.cta.request")}
            </a>
            <a
              href={`/${locale}/products`}
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {t("processPage.cta.viewProducts")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


