import Link from "next/link";
import { getTranslation } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/config";
import type { Database } from "@/types/database";
import { ImageWithFallback } from "./ImageWithFallback";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/ui/AnimateIn";
import { cn } from "@/lib/utils";

type Category = Database["public"]["Tables"]["categories"]["Row"];

interface CategoriesSectionProps {
  categories: Category[];
  locale: Locale;
}

export function CategoriesSection({ categories, locale }: CategoriesSectionProps) {
  const t = (key: string) => getTranslation(locale, key);

  const getCategoryImage = (slug: string): string => {
    const imageMap: Record<string, string> = {
      nuts: "/images/home/categories/nuts.jpg",
      "dried-fruits": "/images/home/categories/dried-fruits.jpg",
      legumes: "/images/home/categories/legumes.jpg",
    };
    return imageMap[slug] || "/images/home/categories/default.jpg";
  };

  const getCategoryDescription = (category: Category): string => {
    const name = locale === "ru" ? category.name_ru : category.name_en;
    return locale === "ru"
      ? `Экспортные поставки: ${name.toLowerCase()} премиум качества`
      : `Premium export quality ${name.toLowerCase()}`;
  };

  return (
    <section className="py-24 sm:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateIn className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
            {t("home.categories.title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("home.categories.subtitle")}
          </p>
        </AnimateIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-6 gap-6">
          {categories.map((category, index) => {
            const categoryName = locale === "ru" ? category.name_ru : category.name_en;
            const imagePath = getCategoryImage(category.slug);
            
            // Bento logic: first item spans 4 columns on md, 2 rows. Others span 2 columns.
            const isLarge = index === 0;

            return (
              <StaggerItem 
                key={category.id} 
                className={cn(
                  "relative group overflow-hidden rounded-3xl bg-background border transition-all duration-500 hover:shadow-2xl hover:-translate-y-1",
                  isLarge ? "md:col-span-4 md:row-span-2 h-[400px] md:h-[600px]" : "md:col-span-2 h-[300px] md:h-[288px]"
                )}
              >
                <Link href={`/${locale}/products?category=${category.slug}`} className="block h-full w-full">
                  <div className="absolute inset-0 z-0">
                    <ImageWithFallback
                      src={imagePath}
                      alt={categoryName}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes={isLarge ? "800px" : "400px"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                    <h3 className={cn(
                      "font-bold text-white mb-2",
                      isLarge ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"
                    )}>
                      {categoryName}
                    </h3>
                    <p className={cn(
                      "text-white/70 line-clamp-2",
                      isLarge ? "text-lg md:text-xl max-w-md" : "text-sm md:text-base"
                    )}>
                      {getCategoryDescription(category)}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}

