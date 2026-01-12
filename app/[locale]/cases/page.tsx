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
    title: t("casesPage.meta.title"),
    description: t("casesPage.meta.description"),
    alternates: {
      canonical: `/${locale}/cases`,
    },
  };
}

export default async function CasesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = (localeParam === "ru" || localeParam === "en" ? localeParam : "en") as Locale;
  const t = (key: string) => getTranslation(locale, key);

  const cases = [
    { id: "c1", title: t("casesPage.cases.c1.title"), description: t("casesPage.cases.c1.description") },
    { id: "c2", title: t("casesPage.cases.c2.title"), description: t("casesPage.cases.c2.description") },
    { id: "c3", title: t("casesPage.cases.c3.title"), description: t("casesPage.cases.c3.description") },
  ];

  const testimonials = [
    { id: "t1", quote: t("casesPage.testimonials.t1.quote"), author: t("casesPage.testimonials.t1.author") },
    { id: "t2", quote: t("casesPage.testimonials.t2.quote"), author: t("casesPage.testimonials.t2.author") },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary">{t("casesPage.hero.badge")}</Badge>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{t("casesPage.hero.title")}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{t("casesPage.hero.subtitle")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("casesPage.note.title")}</CardTitle>
            <CardDescription>{t("casesPage.note.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>{t("casesPage.note.p1")}</p>
            <p>{t("casesPage.note.p2")}</p>
          </CardContent>
        </Card>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cases.map((c) => (
            <Card key={c.id}>
              <CardHeader>
                <CardTitle className="text-base">{c.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{c.description}</CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("casesPage.testimonials.title")}</CardTitle>
            <CardDescription>{t("casesPage.testimonials.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((x) => (
              <div key={x.id} className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">“{x.quote}”</p>
                <p className="text-sm font-medium mt-3">{x.author}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">{t("casesPage.cta.title")}</h2>
          <p className="text-muted-foreground">{t("casesPage.cta.subtitle")}</p>
          <div className="flex items-center justify-center gap-3">
            <a
              href={`/${locale}/contact`}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t("casesPage.cta.contact")}
            </a>
            <a
              href={`/${locale}/products`}
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {t("casesPage.cta.viewProducts")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


