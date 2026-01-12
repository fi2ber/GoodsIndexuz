"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getTranslation } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/config";
import { ImageWithFallback } from "./ImageWithFallback";
import { TrustProofRow } from "./TrustProofRow";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

interface HeroSectionV2Props {
  locale: Locale;
}

export function HeroSectionV2({ locale }: HeroSectionV2Props) {
  const t = (key: string) => getTranslation(locale, key);
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Disable parallax if user prefers reduced motion
  const backgroundY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? ["0%", "0%"] : ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? ["0%", "0%"] : ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], prefersReducedMotion ? [1, 1] : [1, 0]);
  
  // Animation variants that respect reduced motion
  const fadeIn = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[100svh] flex items-center justify-center overflow-hidden"
    >
      {/* Animated Background with Parallax */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 scale-110">
          <ImageWithFallback
            src="/images/home/hero/hero-background.jpg"
            alt="Agricultural products from Uzbekistan"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      </motion.div>

      {/* Multi-layer Premium Overlays */}
      <div className="absolute inset-0 z-[1]">
        {/* Primary gradient - emerald from left */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/50 to-primary/20" />
        {/* Vertical gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
        {/* Radial spotlight effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,transparent_0%,rgba(0,0,0,0.4)_70%)]" />
        {/* Grain texture */}
        <div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none mix-blend-overlay" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
        {/* Golden accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 1.5, delay: prefersReducedMotion ? 0 : 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="absolute top-[20%] left-0 w-[40%] h-[2px] bg-gradient-to-r from-secondary via-secondary/50 to-transparent origin-left"
        />
        {/* Floating shapes - only animate if reduced motion is not preferred */}
        <motion.div
          animate={prefersReducedMotion ? {} : {
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] right-[10%] w-32 h-32 rounded-full bg-secondary/10 blur-2xl"
        />
        <motion.div
          animate={prefersReducedMotion ? {} : {
            y: [0, 15, 0],
            rotate: [0, -5, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[25%] right-[20%] w-48 h-48 rounded-full bg-secondary/5 blur-3xl"
        />
      </div>

      {/* Main Content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 w-full container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-20 sm:py-24 lg:py-32"
      >
        <div className="max-w-4xl">
          {/* Main heading with stagger */}
          <motion.h1
            initial={fadeIn.hidden}
            animate={fadeIn.visible}
            transition={{ duration: prefersReducedMotion ? 0 : 1, delay: prefersReducedMotion ? 0 : 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 tracking-tight text-white leading-[0.95]"
          >
            <span className="block drop-shadow-2xl">
              {t("home.titleLine1") || t("home.title").split(" ").slice(0, 2).join(" ")}
            </span>
            <span className="block mt-2 text-secondary drop-shadow-xl">
              {t("home.titleLine2") || t("home.title").split(" ").slice(2).join(" ")}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={fadeIn.hidden}
            animate={fadeIn.visible}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-10 max-w-2xl leading-relaxed font-light"
          >
            {t("home.subtitle")}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={fadeIn.hidden}
            animate={fadeIn.visible}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="flex flex-col sm:flex-row gap-4"
          >
            {/* Primary CTA with shine effect */}
            <Link href={`/${locale}/products`}>
              <Button
                size="lg"
                className="group relative overflow-hidden w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 bg-secondary hover:bg-secondary/90 text-primary font-bold rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-secondary/30"
              >
                {/* Shine effect */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
                <span className="relative flex items-center gap-2">
                  {t("home.cta")}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>

            {/* Secondary CTA */}
            <Link href={`/${locale}/become-supplier`}>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 rounded-full font-semibold transition-all duration-300 hover:scale-105"
              >
                {t("home.becomeSupplier") || t("nav.becomeSupplier")}
              </Button>
            </Link>
          </motion.div>

          {/* Trust Proof Row */}
          <TrustProofRow locale={locale} variant="light" />
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: prefersReducedMotion ? 0 : 1.5, duration: prefersReducedMotion ? 0 : 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2"
      >
        <span className="text-white/50 text-xs uppercase tracking-widest font-medium">
          {t("home.scroll") || "Scroll"}
        </span>
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5"
        >
          <motion.div
            animate={prefersReducedMotion ? {} : { y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-white/70"
          />
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[3]" />
    </section>
  );
}

