"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTranslation } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/config";
import type { Database } from "@/types/database";
import { ImageWithFallback } from "./ImageWithFallback";
import { motion, useMotionValue, animate, PanInfo, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  categories: {
    id: string;
    name_ru: string;
    name_en: string;
    slug: string;
  };
};

interface FeaturedProductsCarouselProps {
  products: Product[];
  locale: Locale;
}

const CARD_WIDTH = 380;
const CARD_GAP = 24;
const VISIBLE_CARDS = 3;

export function FeaturedProductsCarousel({ products, locale }: FeaturedProductsCarouselProps) {
  const t = (key: string) => getTranslation(locale, key);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  
  const x = useMotionValue(0);
  
  const totalWidth = products.length * (CARD_WIDTH + CARD_GAP) - CARD_GAP;
  const maxDrag = Math.max(0, totalWidth - containerWidth);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const snapToIndex = useCallback((index: number) => {
    const targetX = -index * (CARD_WIDTH + CARD_GAP);
    const clampedX = Math.max(-maxDrag, Math.min(0, targetX));
    if (prefersReducedMotion) {
      x.set(clampedX);
    } else {
      animate(x, clampedX, {
        type: "spring",
        stiffness: 300,
        damping: 30,
      });
    }
    setActiveIndex(index);
  }, [x, maxDrag, prefersReducedMotion]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const currentX = x.get();
    const velocity = info.velocity.x;
    
    // Calculate which card to snap to based on position and velocity
    let newIndex = Math.round(-currentX / (CARD_WIDTH + CARD_GAP));
    
    // Add velocity influence
    if (Math.abs(velocity) > 500) {
      newIndex += velocity > 0 ? -1 : 1;
    }
    
    // Clamp to valid range
    newIndex = Math.max(0, Math.min(products.length - 1, newIndex));
    snapToIndex(newIndex);
  };

  const goToPrev = useCallback(() => {
    const newIndex = Math.max(0, activeIndex - 1);
    snapToIndex(newIndex);
  }, [activeIndex, snapToIndex]);

  const goToNext = useCallback(() => {
    const newIndex = Math.min(products.length - 1, activeIndex + 1);
    snapToIndex(newIndex);
  }, [activeIndex, products.length, snapToIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrev, goToNext]);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-24 sm:py-32 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-secondary" />
              <span className="text-sm font-bold text-secondary uppercase tracking-widest">
                {t("home.featured.badge") || "Featured"}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              {t("home.featured.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
              {t("home.featured.subtitle")}
            </p>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrev}
              disabled={activeIndex === 0}
              className="h-12 w-12 rounded-full border-2 border-primary/20 hover:border-primary hover:bg-primary/5 disabled:opacity-30 transition-all"
              aria-label="Previous product"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              disabled={activeIndex >= products.length - 1}
              className="h-12 w-12 rounded-full border-2 border-primary/20 hover:border-primary hover:bg-primary/5 disabled:opacity-30 transition-all"
              aria-label="Next product"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        {/* Carousel */}
        <div 
          ref={containerRef}
          className="relative overflow-visible"
        >
          <motion.div
            style={{ x }}
            drag="x"
            dragConstraints={{ left: -maxDrag, right: 0 }}
            dragElastic={0.1}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            className="flex gap-6 cursor-grab active:cursor-grabbing"
          >
            {products.map((product, index) => {
              const productName = locale === "ru" ? product.name_ru : product.name_en;
              const categoryName = locale === "ru" ? product.categories.name_ru : product.categories.name_en;
              const origin = locale === "ru" ? product.origin_ru : product.origin_en;
              const images = Array.isArray(product.image_urls)
                ? product.image_urls.filter((url): url is string => typeof url === "string")
                : [];
              const mainImage = images[0];

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  productName={productName}
                  categoryName={categoryName}
                  origin={origin}
                  mainImage={mainImage}
                  locale={locale}
                  index={index}
                  activeIndex={activeIndex}
                  isDragging={isDragging}
                  prefersReducedMotion={!!prefersReducedMotion}
                  t={t}
                />
              );
            })}
          </motion.div>

          {/* Gradient Edges */}
          <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-muted/30 to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-muted/30 to-transparent pointer-events-none z-10" />
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mt-10">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => snapToIndex(index)}
              className={cn(
                "transition-all duration-300 rounded-full",
                activeIndex === index
                  ? "w-8 h-2 bg-secondary"
                  : "w-2 h-2 bg-primary/20 hover:bg-primary/40"
              )}
              aria-label={`Go to product ${index + 1}`}
            />
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link href={`/${locale}/products`}>
            <Button
              variant="outline"
              size="lg"
              className="group h-14 px-10 rounded-full border-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all font-bold text-lg"
            >
              {t("home.featured.viewAll")}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// Separate card component for better performance
interface ProductCardProps {
  product: Product;
  productName: string;
  categoryName: string;
  origin: string | null | undefined;
  mainImage: string | undefined;
  locale: Locale;
  index: number;
  activeIndex: number;
  isDragging: boolean;
  prefersReducedMotion: boolean;
  t: (key: string) => string;
}

function ProductCard({
  product,
  productName,
  categoryName,
  origin,
  mainImage,
  locale,
  index,
  activeIndex,
  isDragging,
  prefersReducedMotion,
  t,
}: ProductCardProps) {
  const isActive = index === activeIndex;

  return (
    <motion.div
      initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : index * 0.1 }}
      style={{ width: CARD_WIDTH, flexShrink: 0 }}
      className="select-none"
    >
      <Card
        className={cn(
          "overflow-hidden border group h-full flex flex-col rounded-[2rem] bg-background transition-all duration-500",
          isActive ? "shadow-2xl scale-100" : "shadow-lg scale-[0.97] opacity-80",
          !isDragging && "hover:shadow-2xl hover:scale-100 hover:opacity-100"
        )}
      >
        {/* Image */}
        <div className="relative h-56 w-full overflow-hidden">
          <ImageWithFallback
            src={mainImage || "/images/placeholder-product.jpg"}
            alt={productName}
            fill
            className={cn(
              "object-cover transition-transform duration-700",
              !isDragging && "group-hover:scale-110"
            )}
            sizes="400px"
            priority={index < 3}
            placeholderText={productName}
          />
          {/* Shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/0 group-hover:via-white/20 group-hover:to-transparent transition-all duration-700 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
          
          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <span className="inline-block bg-secondary/95 backdrop-blur-sm text-primary text-[10px] font-bold tracking-widest uppercase py-1.5 px-3 rounded-full shadow-lg">
              {categoryName}
            </span>
          </div>

          {/* Featured badge if applicable */}
          {product.is_featured && (
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1 bg-primary/90 backdrop-blur-sm text-primary-foreground text-[10px] font-bold tracking-widest uppercase py-1.5 px-3 rounded-full shadow-lg">
                <Sparkles className="w-3 h-3" />
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <CardHeader className="p-6 pb-3">
          <CardTitle className="text-xl font-bold tracking-tight line-clamp-2 group-hover:text-secondary transition-colors">
            {productName}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 pt-0 flex-1 flex flex-col justify-end">
          {/* Quick specs */}
          {(product.moq || origin) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {product.moq && (
                <span className="text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground">
                  MOQ: {product.moq}
                </span>
              )}
              {origin && (
                <span className="text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground">
                  {origin}
                </span>
              )}
            </div>
          )}

          {/* CTA */}
          <Link
            href={`/${locale}/products/${product.slug}`}
            onClick={(e) => isDragging && e.preventDefault()}
            className="block"
          >
            <Button
              className={cn(
                "w-full h-12 rounded-xl font-bold transition-all",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "group-hover:bg-secondary group-hover:text-primary"
              )}
            >
              {t("home.featured.requestPrice")}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}

