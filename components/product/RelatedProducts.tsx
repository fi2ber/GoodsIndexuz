import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getProducts } from "@/lib/db/queries";
import { getTranslation } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/config";

interface RelatedProductsProps {
  categoryId: string;
  currentProductId: string;
  locale: Locale;
}

export async function RelatedProducts({
  categoryId,
  currentProductId,
  locale,
}: RelatedProductsProps) {
  const t = (key: string) => getTranslation(locale, key);
  const products = await getProducts(categoryId);

  // Исключаем текущий продукт и берем максимум 3 товара
  const relatedProducts = products
    .filter((p) => p.id !== currentProductId)
    .slice(0, 3);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">
          {t("products.relatedProducts") || "Related Products"}
        </h2>
        <p className="text-muted-foreground mt-2">
          {t("products.relatedProductsDescription") ||
            "Other products from the same category"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedProducts.map((product) => {
          const productName =
            locale === "ru" ? product.name_ru : product.name_en;
          const categoryName =
            locale === "ru"
              ? product.categories.name_ru
              : product.categories.name_en;
          const images = Array.isArray(product.image_urls)
            ? product.image_urls
            : [];
          const mainImage = images[0] as string | undefined;

          return (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {mainImage ? (
                <div className="relative h-48 w-full">
                  <Image
                    src={mainImage}
                    alt={productName}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 w-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">No image</span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl line-clamp-2">{productName}</CardTitle>
                <CardDescription>{categoryName}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/${locale}/products/${product.slug}`}>
                  <Button className="w-full">{t("products.viewDetails")}</Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

