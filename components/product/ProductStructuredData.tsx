"use client";

import { useEffect } from "react";

interface ProductStructuredDataProps {
  product: {
    id: string;
    name_ru: string;
    name_en: string;
    description_ru?: string | null;
    description_en?: string | null;
    image_urls: string[];
    category: {
      name_ru: string;
      name_en: string;
    };
    hs_code?: string | null;
    moq?: string | null;
    slug: string;
    view_count?: number;
  };
  locale: "ru" | "en";
  baseUrl: string;
}

export function ProductStructuredData({
  product,
  locale,
  baseUrl,
}: ProductStructuredDataProps) {
  useEffect(() => {
    const productName = locale === "ru" ? product.name_ru : product.name_en;
    const description = locale === "ru" ? product.description_ru : product.description_en;
    const categoryName = locale === "ru" ? product.category.name_ru : product.category.name_en;
    const images = Array.isArray(product.image_urls) 
      ? product.image_urls.filter((url): url is string => typeof url === 'string')
      : [];

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: productName,
      description: description || `${productName} - ${categoryName} from Uzbekistan`,
      image: images.map(img => img.startsWith("http") ? img : `${baseUrl}${img}`),
      category: categoryName,
      brand: {
        "@type": "Brand",
        name: "GoodsIndexuz",
      },
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        priceCurrency: "USD",
        url: `${baseUrl}/${locale}/products/${product.slug}`,
      },
      identifier: product.hs_code || undefined,
      sku: product.slug,
      aggregateRating: product.view_count && product.view_count > 0 ? {
        "@type": "AggregateRating",
        ratingValue: "4.5",
        reviewCount: product.view_count,
      } : undefined,
    };

    // Remove undefined fields
    Object.keys(structuredData).forEach(key => {
      if (structuredData[key as keyof typeof structuredData] === undefined) {
        delete structuredData[key as keyof typeof structuredData];
      }
    });

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    script.id = "product-structured-data";
    
    // Remove existing script if any
    const existing = document.getElementById("product-structured-data");
    if (existing) {
      existing.remove();
    }
    
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById("product-structured-data");
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [product, locale, baseUrl]);

  return null;
}

