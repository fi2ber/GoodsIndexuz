import type { Locale } from "@/lib/i18n/config";
import { getTranslation } from "@/lib/i18n/translations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type CertificateItem = {
  id: string;
  title: string;
  description: string;
  note?: string;
  fileUrl?: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = (localeParam === "ru" || localeParam === "en" ? localeParam : "en") as Locale;
  const t = (key: string) => getTranslation(locale, key);

  return {
    title: t("certificates.meta.title"),
    description: t("certificates.meta.description"),
    alternates: {
      canonical: `/${locale}/certificates`,
    },
  };
}

export default async function CertificatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = (localeParam === "ru" || localeParam === "en" ? localeParam : "en") as Locale;
  const t = (key: string) => getTranslation(locale, key);

  const certificates: CertificateItem[] = [
    {
      id: "docset",
      title: t("certificates.list.docset.title"),
      description: t("certificates.list.docset.description"),
      note: t("certificates.list.docset.note"),
    },
    {
      id: "origin",
      title: t("certificates.list.origin.title"),
      description: t("certificates.list.origin.description"),
    },
    {
      id: "quality",
      title: t("certificates.list.quality.title"),
      description: t("certificates.list.quality.description"),
    },
    {
      id: "phytosanitary",
      title: t("certificates.list.phytosanitary.title"),
      description: t("certificates.list.phytosanitary.description"),
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary">{t("certificates.hero.badge")}</Badge>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{t("certificates.hero.title")}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t("certificates.hero.subtitle")}
          </p>
        </div>

        {/* Core promise */}
        <Card>
          <CardHeader>
            <CardTitle>{t("certificates.promise.title")}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>{t("certificates.promise.p1")}</p>
            <p>{t("certificates.promise.p2")}</p>
          </CardContent>
        </Card>

        <Separator />

        {/* Document list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map((c) => (
            <Card key={c.id}>
              <CardHeader>
                <CardTitle className="text-base">{c.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{c.description}</p>
                {c.note ? <p className="text-xs text-muted-foreground">{c.note}</p> : null}
                {c.fileUrl ? (
                  <a href={c.fileUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      {t("certificates.actions.download")}
                    </Button>
                  </a>
                ) : (
                  <p className="text-xs text-muted-foreground">{t("certificates.actions.onRequest")}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Compliance */}
        <Card>
          <CardHeader>
            <CardTitle>{t("certificates.compliance.title")}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">{t("certificates.compliance.s1.title")}</p>
              <p className="text-sm text-muted-foreground">{t("certificates.compliance.s1.description")}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">{t("certificates.compliance.s2.title")}</p>
              <p className="text-sm text-muted-foreground">{t("certificates.compliance.s2.description")}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">{t("certificates.compliance.s3.title")}</p>
              <p className="text-sm text-muted-foreground">{t("certificates.compliance.s3.description")}</p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">{t("certificates.cta.title")}</h2>
          <p className="text-muted-foreground">{t("certificates.cta.subtitle")}</p>
          <div className="flex items-center justify-center gap-3">
            <a
              href={`/${locale}/contact`}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t("certificates.cta.requestDocs")}
            </a>
            <a
              href={`/${locale}/products`}
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {t("certificates.cta.viewProducts")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


