import { getCategories } from "@/lib/db/queries";
import { getTranslation } from "@/lib/i18n/translations";
import { BecomeSupplierClient } from "@/components/submission/BecomeSupplierClient";
import type { Locale } from "@/lib/i18n/config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default async function BecomeSupplierPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = (localeParam === "ru" || localeParam === "en" ? localeParam : "en") as Locale;
  const t = (key: string) => getTranslation(locale, key);

  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">
            {locale === "ru" ? "Стать поставщиком" : "Become a Supplier"}
          </h1>
          <p className="text-lg text-muted-foreground">
            {locale === "ru"
              ? "Предложите свой товар для продажи через нашу платформу"
              : "Submit your product for sale through our platform"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {locale === "ru" ? "Простой процесс" : "Simple Process"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {locale === "ru"
                  ? "Заполните форму с информацией о вашем товаре. Мы рассмотрим вашу заявку в течение 2-3 рабочих дней."
                  : "Fill out the form with your product information. We'll review your submission within 2-3 business days."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {locale === "ru" ? "Быстрая модерация" : "Quick Review"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {locale === "ru"
                  ? "Наша команда проверит качество и соответствие стандартам экспорта перед публикацией."
                  : "Our team will verify quality and export standards compliance before publishing."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {locale === "ru" ? "Глобальный охват" : "Global Reach"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {locale === "ru"
                  ? "Ваш товар будет доступен международным покупателям и дистрибьюторам."
                  : "Your product will be available to international buyers and distributors."}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {locale === "ru" ? "Форма предложения товара" : "Product Submission Form"}
            </CardTitle>
            <CardDescription>
              {locale === "ru"
                ? "Заполните все необходимые поля. Поля, отмеченные *, обязательны для заполнения."
                : "Fill in all required fields. Fields marked with * are required."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BecomeSupplierClient categories={categories} locale={locale} />
          </CardContent>
        </Card>

        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h3 className="font-semibold mb-4">
            {locale === "ru" ? "Что происходит после отправки?" : "What happens after submission?"}
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">
                {locale === "ru"
                  ? "Вы получите подтверждение на email о получении заявки"
                  : "You'll receive an email confirmation that we received your submission"}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">
                {locale === "ru"
                  ? "Наша команда рассмотрит заявку в течение 2-3 рабочих дней"
                  : "Our team will review your submission within 2-3 business days"}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">
                {locale === "ru"
                  ? "Вы получите уведомление о статусе модерации (одобрено/отклонено)"
                  : "You'll receive a notification about the moderation status (approved/rejected)"}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">
                {locale === "ru"
                  ? "При одобрении товар будет автоматически добавлен в каталог"
                  : "If approved, your product will be automatically added to the catalog"}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

