import type { Locale } from "@/lib/i18n/config";
import { getCategories, getFeaturedProducts } from "@/lib/db/queries";
import { HeroSectionV2 } from "@/components/home/HeroSectionV2";
import { StatsSection } from "@/components/home/StatsSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { OriginSection } from "@/components/home/OriginSection";
import { FeaturedProductsCarousel } from "@/components/home/FeaturedProductsCarousel";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { FAQSection } from "@/components/home/FAQSection";
import { FinalCTA } from "@/components/home/FinalCTA";
import { TrustIndicators } from "@/components/home/TrustIndicators";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = (localeParam === "ru" || localeParam === "en" ? localeParam : "en") as Locale;

  // Load data from database
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(6),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSectionV2 locale={locale} />

      {/* Stats Section */}
      <StatsSection locale={locale} />

      {/* Categories Section */}
      <CategoriesSection categories={categories} locale={locale} />

      {/* Origin Section */}
      <OriginSection locale={locale} />

      {/* Featured Products Carousel */}
      <FeaturedProductsCarousel products={featuredProducts} locale={locale} />

      {/* Benefits Section */}
      <BenefitsSection locale={locale} />

      {/* Process Section */}
      <ProcessSection locale={locale} />

      {/* Trust Indicators (Updated) */}
      <TrustIndicators locale={locale} />

      {/* FAQ Section */}
      <FAQSection locale={locale} />

      {/* Final CTA */}
      <FinalCTA locale={locale} />
    </div>
  );
}

