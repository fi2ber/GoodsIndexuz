import type { Locale } from "@/lib/i18n/config";
import { getTranslation } from "@/lib/i18n/translations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ContactForm } from "@/components/contact/ContactForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = (localeParam === "ru" || localeParam === "en" ? localeParam : "en") as Locale;
  const t = (key: string) => getTranslation(locale, key);

  return {
    title: t("contactPage.meta.title"),
    description: t("contactPage.meta.description"),
    alternates: {
      canonical: `/${locale}/contact`,
    },
  };
}

export default async function ContactPage({
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
            <Badge variant="secondary">{t("contactPage.hero.badge")}</Badge>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{t("contactPage.hero.title")}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t("contactPage.hero.subtitle")}
          </p>
        </div>

        {/* Contact blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t("contactPage.form.title")}</CardTitle>
              <CardDescription>{t("contactPage.form.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm locale={locale} />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("contactPage.details.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground">{t("contactPage.details.company")}</p>
                  <p className="font-medium">{t("contactPage.details.companyValue")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t("contactPage.details.email")}</p>
                  <p className="font-medium">{t("contactPage.details.emailValue")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t("contactPage.details.phone")}</p>
                  <p className="font-medium">{t("contactPage.details.phoneValue")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t("contactPage.details.messaging")}</p>
                  <p className="font-medium">{t("contactPage.details.messagingValue")}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("contactPage.hours.title")}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>{t("contactPage.hours.line1")}</p>
                <p>{t("contactPage.hours.line2")}</p>
                <p>{t("contactPage.hours.line3")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("contactPage.location.title")}</CardTitle>
                <CardDescription>{t("contactPage.location.subtitle")}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {t("contactPage.location.note")}
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        {/* Departments (placeholder but structured) */}
        <Card>
          <CardHeader>
            <CardTitle>{t("contactPage.departments.title")}</CardTitle>
            <CardDescription>{t("contactPage.departments.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">{t("contactPage.departments.sales.title")}</p>
              <p className="text-sm text-muted-foreground">{t("contactPage.departments.sales.description")}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">{t("contactPage.departments.logistics.title")}</p>
              <p className="text-sm text-muted-foreground">
                {t("contactPage.departments.logistics.description")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">{t("contactPage.departments.quality.title")}</p>
              <p className="text-sm text-muted-foreground">{t("contactPage.departments.quality.description")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


