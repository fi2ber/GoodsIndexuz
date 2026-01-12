"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getTranslation } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/config";
import { ImageWithFallback } from "./ImageWithFallback";
import { motion } from "framer-motion";
import { Magnetic } from "@/components/ui/Magnetic";

interface HeroSectionProps {
  locale: Locale;
}

export function HeroSection({ locale }: HeroSectionProps) {
  const t = (key: string) => getTranslation(locale, key);

  return (
    <section className="relative w-full h-[600px] sm:h-[700px] lg:h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image & Premium Overlays in Modern Silk Road palette */}
      <div className="absolute inset-0 z-0 bg-background">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="/images/home/hero/hero-background.jpg"
            alt="Agricultural products from Uzbekistan"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        {/* Modern multi-layer overlay — усиленный для лучшей читаемости */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 via-primary/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-left w-full container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 sm:py-0">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <span className="inline-block bg-secondary/95 backdrop-blur-sm text-primary text-[10px] sm:text-xs font-bold tracking-widest uppercase py-1.5 sm:py-2 px-3 sm:px-4 rounded-full mb-4 sm:mb-6 shadow-lg">
              {t("home.trust")}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 tracking-tight text-white leading-[1.1] drop-shadow-2xl">
              {t("home.title")}
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-8 sm:mb-10 max-w-2xl leading-relaxed drop-shadow-lg"
          >
            {t("home.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <Magnetic>
              <Link href={`/${locale}/products`} className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 bg-secondary hover:bg-secondary/90 text-primary font-bold rounded-full transition-transform hover:scale-105 active:scale-95 shadow-xl backdrop-blur-sm">
                  {t("home.cta")}
                </Button>
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href={`/${locale}/about`} className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 bg-white/95 backdrop-blur-md border-2 border-white/50 text-primary hover:bg-white hover:text-primary rounded-full font-semibold shadow-xl transition-all">
                  {t("common.about")}
                </Button>
              </Link>
            </Magnetic>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden sm:block"
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-white/60 to-transparent" />
      </motion.div>
    </section>
  );
}
