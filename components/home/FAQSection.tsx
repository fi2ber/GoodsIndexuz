import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getTranslation } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/config";

interface FAQSectionProps {
  locale: Locale;
}

interface FAQ {
  questionKey: string;
  answerKey: string;
}

export function FAQSection({ locale }: FAQSectionProps) {
  const t = (key: string) => getTranslation(locale, key);

  const faqs: FAQ[] = [
    {
      questionKey: "home.faq.moq.question",
      answerKey: "home.faq.moq.answer",
    },
    {
      questionKey: "home.faq.payment.question",
      answerKey: "home.faq.payment.answer",
    },
    {
      questionKey: "home.faq.delivery.question",
      answerKey: "home.faq.delivery.answer",
    },
    {
      questionKey: "home.faq.quality.question",
      answerKey: "home.faq.quality.answer",
    },
    {
      questionKey: "home.faq.samples.question",
      answerKey: "home.faq.samples.answer",
    },
    {
      questionKey: "home.faq.contract.question",
      answerKey: "home.faq.contract.answer",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            {t("home.faq.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("home.faq.subtitle")}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {t(faq.questionKey)}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {t(faq.answerKey)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

