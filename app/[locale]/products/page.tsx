import Link from "next/link";
import { getProducts, getCategories } from "@/lib/db/queries";
import { getTranslation } from "@/lib/i18n/translations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n/config";
import Image from "next/image";

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale: localeParam } = await params;
  const { category: categoryFilter } = await searchParams;
  const locale = (localeParam === "ru" || localeParam === "en" ? localeParam : "en") as Locale;
  const t = (key: string) => getTranslation(locale, key);

  const [products, categories] = await Promise.all([
    getProducts(categoryFilter || undefined),
    getCategories(),
  ]);

  const productName = (product: typeof products[0]) =>
    locale === "ru" ? product.name_ru : product.name_en;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">{t("products.title")}</h1>
        <div className="flex flex-wrap gap-2 mt-6">
          <Link href={`/${locale}/products`}>
            <Button
              variant={!categoryFilter ? "default" : "outline"}
              size="sm"
            >
              {t("products.allCategories")}
            </Button>
          </Link>
          {categories.map((category) => {
            const isActive = categoryFilter === category.id || categoryFilter === category.slug;
            return (
              <Link key={category.id} href={`/${locale}/products?category=${category.slug}`}>
                <Button
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                >
                  {locale === "ru" ? category.name_ru : category.name_en}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("products.noProducts")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const images = Array.isArray(product.image_urls)
              ? product.image_urls.filter((url): url is string => typeof url === 'string')
              : [];
            const mainImage = images[0];

            return (
              <Card key={product.id} className="overflow-hidden">
                {mainImage ? (
                  <div className="relative h-48 w-full">
                    <Image
                      src={mainImage}
                      alt={productName(product)}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 w-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{productName(product)}</CardTitle>
                  <CardDescription>
                    {locale === "ru"
                      ? product.categories.name_ru
                      : product.categories.name_en}
                  </CardDescription>
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
      )}
    </div>
  );
}

