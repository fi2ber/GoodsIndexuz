import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslation } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/config";
import { Shield, Award, Truck } from "lucide-react";

interface TrustIndicatorsProps {
  locale: Locale;
}

export function TrustIndicators({ locale }: TrustIndicatorsProps) {
  const t = (key: string) => getTranslation(locale, key);

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-4 mb-2">
                <div className="rounded-full bg-secondary/10 p-3 border border-secondary/20">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-2xl">{t("home.trust")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                {locale === "ru"
                  ? "Надежный партнер для международной торговли"
                  : "Trusted partner for international trade"}
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-4 mb-2">
                <div className="rounded-full bg-secondary/10 p-3 border border-secondary/20">
                  <Award className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-2xl">{t("home.quality")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                {locale === "ru"
                  ? "Соответствие международным стандартам качества"
                  : "Compliance with international quality standards"}
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-4 mb-2">
                <div className="rounded-full bg-secondary/10 p-3 border border-secondary/20">
                  <Truck className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-2xl">{t("home.logistics")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                {locale === "ru"
                  ? "Полная готовность к экспорту и логистике"
                  : "Full export and logistics readiness"}
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

