import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTranslation } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/config";
import type { Database } from "@/types/database";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/ui/AnimateIn";
import { Magnetic } from "@/components/ui/Magnetic";
import { ImageWithFallback } from "./ImageWithFallback";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  categories: {
    id: string;
    name_ru: string;
    name_en: string;
    slug: string;
  };
};

interface FeaturedProductsProps {
  products: Product[];
  locale: Locale;
}

export function FeaturedProducts({ products, locale }: FeaturedProductsProps) {
  const t = (key: string) => getTranslation(locale, key);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateIn className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
            {t("home.featured.title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("home.featured.subtitle")}
          </p>
        </AnimateIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const productName = locale === "ru" ? product.name_ru : product.name_en;
            const categoryName = locale === "ru" ? product.categories.name_ru : product.categories.name_en;
            const images = Array.isArray(product.image_urls)
              ? product.image_urls.filter((url): url is string => typeof url === 'string')
              : [];
            const mainImage = images[0];

            return (
              <StaggerItem key={product.id}>
                <Card className="overflow-hidden border group hover:shadow-2xl transition-all duration-500 h-full flex flex-col rounded-[2.5rem] bg-background/50 backdrop-blur-sm">
                  <div className="relative h-64 w-full overflow-hidden">
                    <ImageWithFallback
                      src={mainImage || "/images/placeholder-product.jpg"}
                      alt={productName}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      placeholderText={productName}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </div>
                  <CardHeader className="p-8 pb-4">
                    <CardDescription className="mb-2 uppercase tracking-[0.2em] font-bold text-[10px] text-secondary">
                      {categoryName}
                    </CardDescription>
                    <CardTitle className="text-2xl font-bold tracking-tight group-hover:text-secondary transition-colors">
                      {productName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 flex-1 flex flex-col justify-end">
                    <Link href={`/${locale}/products/${product.slug}`}>
                      <Button className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all shadow-md">
                        {t("home.featured.requestPrice")}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <AnimateIn className="text-center mt-16" delay={0.3}>
          <Magnetic>
            <Link href={`/${locale}/products`}>
              <Button variant="outline" size="lg" className="h-14 px-12 rounded-full border-primary/30 text-primary hover:bg-primary/5 transition-all font-bold text-lg">
                {t("home.featured.viewAll")}
              </Button>
            </Link>
          </Magnetic>
        </AnimateIn>
      </div>
    </section>
  );
}

