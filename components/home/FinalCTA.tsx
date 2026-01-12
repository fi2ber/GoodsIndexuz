"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getTranslation } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/config";
import { ArrowRight, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

interface FinalCTAProps {
  locale: Locale;
}

export function FinalCTA({ locale }: FinalCTAProps) {
  const t = (key: string) => getTranslation(locale, key);

  return (
    <section className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="bg-primary text-primary-foreground rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-20 text-center relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Golden glow */}
            <div className="absolute top-[-30%] right-[-15%] w-[60%] h-[150%] bg-secondary/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-30%] left-[-15%] w-[50%] h-[120%] bg-secondary/10 blur-[100px] rounded-full" />
            {/* Subtle pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,transparent_0%,rgba(0,0,0,0.2)_100%)]" />
            {/* Grain */}
            <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay" />
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm text-secondary text-xs font-bold tracking-widest uppercase py-2 px-4 rounded-full mb-8">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                {t("home.finalCta.badge") || "Ready to Export"}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold mb-6 tracking-tight leading-[1.1]"
            >
              {t("home.finalCta.title")}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl lg:text-2xl mb-10 max-w-2xl mx-auto opacity-80 leading-relaxed"
            >
              {t("home.finalCta.subtitle")}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {/* Primary CTA */}
              <Link href={`/${locale}/products`}>
                <Button
                  size="lg"
                  className="group relative overflow-hidden w-full sm:w-auto text-base sm:text-lg px-8 sm:px-12 py-6 sm:py-7 bg-secondary hover:bg-secondary/90 text-primary font-bold rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-secondary/30"
                >
                  {/* Shine effect */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
                  <span className="relative flex items-center gap-2">
                    {t("home.finalCta.viewProducts")}
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>

              {/* Secondary CTA */}
              <Link href={`/${locale}/contact`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-12 py-6 sm:py-7 bg-white/5 backdrop-blur-sm border-2 border-white/20 text-primary-foreground hover:bg-white/10 hover:border-white/40 rounded-full font-semibold transition-all duration-300 hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {t("home.finalCta.contactUs")}
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
