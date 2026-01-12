import { notFound } from "next/navigation";
import { getProductBySlug, getProductMarketSeries, getLatestProductMarketQuote } from "@/lib/db/queries";
import { getTranslation } from "@/lib/i18n/translations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { InquiryForm } from "@/components/inquiry/InquiryForm";
import { ProductSpecsTable } from "@/components/product/ProductSpecsTable";
import { ProductBadges } from "@/components/product/ProductBadges";
import { ProductDescription } from "@/components/product/ProductDescription";
import { StickyInquiryCTA } from "@/components/product/StickyInquiryCTA";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { ProductQuickActions } from "@/components/product/ProductQuickActions";
import { ProductSeasonality } from "@/components/product/ProductSeasonality";
import { ProductCertificates } from "@/components/product/ProductCertificates";
import { ProductLogisticsInfo } from "@/components/product/ProductLogisticsInfo";
import { ProductViewTracker } from "@/components/product/ProductViewTracker";
import { ProductStructuredData } from "@/components/product/ProductStructuredData";
import { Settings } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";
import dynamic from "next/dynamic";

// Lazy load heavy components
const RelatedProducts = dynamic(() => import("@/components/product/RelatedProducts").then(mod => ({ default: mod.RelatedProducts })), {
  loading: () => <div className="h-64 flex items-center justify-center text-muted-foreground">Loading related products...</div>,
  ssr: true,
});

// Lazy load ProductMarketIndex to avoid blocking compilation
const ProductMarketIndex = dynamic(() => import("@/components/product/ProductMarketIndex").then(mod => ({ default: mod.ProductMarketIndex })), {
  loading: () => null,
  ssr: false, // Client-side only since it uses recharts
});

// Cache product pages for 1 hour, revalidate on demand
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = (localeParam === "ru" || localeParam === "en" ? localeParam : "en") as Locale;
  
  try {
    const product = await getProductBySlug(slug);
    if (!product) {
      return {};
    }

    const productName = locale === "ru" ? product.name_ru : product.name_en;
    const description = locale === "ru" ? product.description_ru : product.description_en;
    const categoryName = locale === "ru" ? product.categories.name_ru : product.categories.name_en;
    const images = Array.isArray(product.image_urls) 
      ? product.image_urls.filter((url): url is string => typeof url === 'string')
      : [];
    const mainImage = images[0] || "";

    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const currentUrl = `${protocol}://${host}/${locale}/products/${slug}`;

    const metaDescription = description 
      ? description.substring(0, 160)
      : `${productName} - ${categoryName} from Uzbekistan. B2B wholesale export.`;

    return {
      title: `${productName} | GoodsIndexuz`,
      description: metaDescription,
      openGraph: {
        title: productName,
        description: metaDescription,
        type: "website",
        url: currentUrl,
        images: mainImage ? [
          {
            url: mainImage.startsWith("http") ? mainImage : `${protocol}://${host}${mainImage}`,
            width: 1200,
            height: 630,
            alt: productName,
          }
        ] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: productName,
        description: metaDescription,
        images: mainImage ? [mainImage.startsWith("http") ? mainImage : `${protocol}://${host}${mainImage}`] : [],
      },
      alternates: {
        canonical: currentUrl,
        languages: {
          ru: `${protocol}://${host}/ru/products/${slug}`,
          en: `${protocol}://${host}/en/products/${slug}`,
          "x-default": `${protocol}://${host}/en/products/${slug}`,
        },
      },
    };
  } catch {
    return {};
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale = (localeParam === "ru" || localeParam === "en" ? localeParam : "en") as Locale;
  const t = (key: string) => getTranslation(locale, key);

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const productName = locale === "ru" ? product.name_ru : product.name_en;
  const categoryName =
    locale === "ru" ? product.categories.name_ru : product.categories.name_en;
  const variety = locale === "ru" ? product.variety_ru : product.variety_en;
  const origin = locale === "ru" ? product.origin_ru : product.origin_en;
  const grade = locale === "ru" ? product.grade_ru : product.grade_en;
  const originPlace = locale === "ru" ? product.origin_place_ru : product.origin_place_en;
  const description = locale === "ru" ? product.description_ru : product.description_en;
  const processingMethod = locale === "ru" ? product.processing_method_ru : product.processing_method_en;
  // Убеждаемся, что image_urls правильно парсится как массив строк
  const images = Array.isArray(product.image_urls) 
    ? product.image_urls.filter((url): url is string => typeof url === 'string')
    : [];
  // Убеждаемся, что calibers правильно парсится как массив строк
  const calibers = Array.isArray(product.calibers)
    ? product.calibers.filter((caliber): caliber is string => typeof caliber === 'string')
    : [];
  
  // Новые поля
  const certificates = locale === "ru" 
    ? (Array.isArray(product.certificates_ru) ? product.certificates_ru : [])
    : (Array.isArray(product.certificates_en) ? product.certificates_en : []);
  const seasonality = Array.isArray(product.seasonality) 
    ? product.seasonality.filter((m): m is number => typeof m === 'number' && m >= 1 && m <= 12)
    : [];
  const logisticsInfo = locale === "ru" 
    ? (product.logistics_info_ru && typeof product.logistics_info_ru === 'object' ? product.logistics_info_ru : null)
    : (product.logistics_info_en && typeof product.logistics_info_en === 'object' ? product.logistics_info_en : null);
  const faqs = locale === "ru"
    ? (Array.isArray(product.faqs_ru) ? product.faqs_ru : [])
    : (Array.isArray(product.faqs_en) ? product.faqs_en : []);

  // Market Index data
  // #region agent log
  let marketSeries: any[] = [];
  let latestMarketQuote: any = null;
  try {
    console.log("Fetching market series for product:", product.id);
    marketSeries = await getProductMarketSeries(product.id);
    console.log("Market series fetched, length:", marketSeries.length);
  } catch (error: any) {
    console.error("Error fetching market series:", error);
    // Continue without market data - don't break the page
    marketSeries = [];
  }
  try {
    console.log("Fetching latest market quote for product:", product.id);
    latestMarketQuote = await getLatestProductMarketQuote(product.id);
    console.log("Latest quote fetched:", !!latestMarketQuote);
  } catch (error: any) {
    console.error("Error fetching latest market quote:", error);
    // Continue without market data - don't break the page
    latestMarketQuote = null;
  }
  // #endregion

  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const baseUrl = `${protocol}://${host}`;

  return (
    <>
      <ProductStructuredData 
        product={{
          id: product.id,
          name_ru: product.name_ru,
          name_en: product.name_en,
          description_ru: product.description_ru,
          description_en: product.description_en,
          image_urls: images,
          category: product.categories,
          hs_code: product.hs_code,
          moq: product.moq,
          slug: product.slug,
        }}
        locale={locale}
        baseUrl={baseUrl}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <ProductViewTracker productId={product.id} />
        <div className="space-y-12">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <ProductImageGallery 
            images={images} 
            productName={productName}
            videoUrl={product.video_url}
          />

          {/* Product Info - Hero */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Badge variant="secondary" className="mb-3">
                    {categoryName}
                  </Badge>
                  <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                    {productName}
                  </h1>
                </div>
                <ProductQuickActions locale={locale} productName={productName} />
              </div>

              {/* Trust Badges */}
              <ProductBadges
                hsCode={product.hs_code}
                moq={product.moq}
                exportReadiness={product.export_readiness}
                origin={origin}
                locale={locale}
              />
            </div>

            {/* Quick Specs Table */}
            <ProductSpecsTable
              hsCode={product.hs_code}
              grade={grade}
              originPlace={originPlace}
              calibers={calibers}
              variety={variety}
              origin={origin}
              moq={product.moq}
              packaging={product.packaging_options as string[] | null}
              shelfLife={product.shelf_life}
              locale={locale}
            />

            {/* Product Description */}
            {description && (
              <ProductDescription description={description} />
            )}

            {/* Inquiry Form */}
            <Card id="inquiry-form">
              <CardHeader>
                <CardTitle className="text-2xl">{t("inquiry.title")}</CardTitle>
                <CardDescription>{t("inquiry.subtitle")}</CardDescription>
              </CardHeader>
              <CardContent>
                <InquiryForm productId={product.id} locale={locale} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Market Index */}
        {marketSeries && Array.isArray(marketSeries) && marketSeries.length > 0 && latestMarketQuote && (
          <Suspense fallback={null}>
            <ProductMarketIndex
              series={marketSeries}
              latestQuote={{
                date: latestMarketQuote.quote_date,
                priceMidUsd: Number(latestMarketQuote.price_mid_usd) || 0,
                toleranceUsd: Number(latestMarketQuote.tolerance_usd) || 0.005,
              }}
              locale={locale}
            />
          </Suspense>
        )}

        {/* New Enhancement Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {seasonality.length > 0 && (
            <ProductSeasonality seasonality={seasonality} locale={locale} />
          )}
          {logisticsInfo && (
            <ProductLogisticsInfo logisticsInfo={logisticsInfo} locale={locale} />
          )}
        </div>

        {certificates.length > 0 && (
          <ProductCertificates certificates={certificates} locale={locale} />
        )}

        {/* FAQs */}
        {faqs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t("products.faqs") || "Frequently Asked Questions"}</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq: {question: string; answer: string}, idx: number) => (
                  <AccordionItem key={idx} value={`faq-${idx}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {faq.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}

        {/* Detailed Information - Accordion */}
        {(processingMethod ||
          product.export_readiness ||
          (product.packaging_options &&
            Array.isArray(product.packaging_options) &&
            product.packaging_options.length > 0)) && (
          <div className="max-w-4xl">
            <Accordion type="single" collapsible className="w-full">
              {processingMethod && (
                <AccordionItem value="processing-method">
                  <AccordionTrigger className="text-lg">
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      {t("products.processingMethod")}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {processingMethod}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              )}

              {product.packaging_options &&
                Array.isArray(product.packaging_options) &&
                product.packaging_options.length > 0 && (
                  <AccordionItem value="packaging-details">
                    <AccordionTrigger className="text-lg">
                      {t("products.packaging")}
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        {product.packaging_options.map((pkg: string, idx: number) => (
                          <li key={idx}>{pkg}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )}

              {product.export_readiness && (
                <AccordionItem value="export-readiness">
                  <AccordionTrigger className="text-lg">
                    {t("products.exportReadiness")}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {product.export_readiness}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        )}

        {/* Related Products */}
        <Suspense fallback={<div className="h-64 flex items-center justify-center text-muted-foreground">Loading related products...</div>}>
          <RelatedProducts
            categoryId={product.category_id}
            currentProductId={product.id}
            locale={locale}
          />
        </Suspense>
        </div>

        {/* Sticky CTA for Mobile */}
        <StickyInquiryCTA locale={locale} />
      </div>
    </>
  );
}
