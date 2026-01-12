"use client";

import { getTranslation } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/config";
import { Award, Truck, Package, Headphones, Shield, Globe } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { ImageWithFallback } from "./ImageWithFallback";
import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";

interface BenefitsSectionProps {
  locale: Locale;
}

type BenefitItem = {
  icon: React.ComponentType<{ className?: string }>;
  titleKey: string;
  descriptionKey: string;
};

interface BenefitCardProps {
  benefit: BenefitItem;
  index: number;
  title: string;
  description: string;
  fanImages: string[];
  prefersReducedMotion: boolean;
}

function BenefitCard({
  benefit,
  index,
  title,
  description,
  fanImages,
  prefersReducedMotion,
}: BenefitCardProps) {
  const Icon = benefit.icon;
  // focus is a float in [0..2] driven by mouse X position (hover-scrub)
  const [focus, setFocus] = useState<number>(1);
  const [isHover, setIsHover] = useState(false);

  const updateFocusFromEvent = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = rect.width > 0 ? Math.max(0, Math.min(1, x / rect.width)) : 0.5;
    setFocus(ratio * 2);
  }, []);

  const base = [
    { rotate: -10, x: -18, y: 8 },
    { rotate: 0, x: 0, y: 0 },
    { rotate: 10, x: 18, y: 6 },
  ] as const;

  return (
    <motion.div
      className="group"
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      onPointerMove={updateFocusFromEvent}
    >
      <div className="relative h-full p-8 rounded-3xl bg-muted/30 border border-border/50 transition-all duration-500 hover:bg-background hover:shadow-2xl hover:border-secondary/30 hover:-translate-y-1 overflow-hidden">
        {/* Icon container */}
        <div className="relative mb-6">
          <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center transition-all duration-500 group-hover:bg-secondary group-hover:scale-110">
            <Icon className="h-7 w-7 text-secondary transition-colors duration-500 group-hover:text-primary" />
          </div>
          {/* Decorative number */}
          <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            {index + 1}
          </span>
        </div>

        {/* Photo fan hover-scrub (desktop only) */}
        <div
          className={cn(
            "pointer-events-none absolute top-6 right-6 hidden lg:block",
            "w-[200px] h-[140px]"
          )}
          aria-hidden="true"
        >
          {[0, 1, 2].map((i) => {
            const distance = Math.abs(i - focus); // 0..2
            const visibility = Math.max(0, 1 - distance * 0.35); // 1..0.3
            const lift = Math.max(0, 1 - distance) * 10; // 0..10
            const scale = 1 + Math.max(0, 1 - distance) * 0.06; // 1..1.06

            // Higher z-index when closer to focus
            const z = 50 - Math.round(distance * 10) + i;

            return (
              <motion.div
                key={i}
                className={cn(
                  "absolute top-0 right-0",
                  "w-[140px] h-[96px] rounded-2xl overflow-hidden",
                  "shadow-2xl ring-1 ring-white/20 bg-white/5"
                )}
                style={{ zIndex: z }}
                animate={{
                  opacity: isHover ? visibility : 0,
                  x: base[i].x,
                  y: isHover ? base[i].y - lift : base[i].y + 10,
                  rotate: base[i].rotate,
                  scale: isHover ? scale : prefersReducedMotion ? 1 : 0.96,
                }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.28,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
              >
                <ImageWithFallback
                  src={fanImages[i] || "/images/home/hero/hero-background.jpg"}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="140px"
                  placeholderText=" "
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />
                {/* subtle focus vignette */}
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{ opacity: isHover ? Math.max(0, 0.35 - distance * 0.15) : 0 }}
                />
              </motion.div>
            );
          })}
        </div>

        <h3 className="text-xl font-bold mb-3 tracking-tight group-hover:text-secondary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

export function BenefitsSection({ locale }: BenefitsSectionProps) {
  const t = (key: string) => getTranslation(locale, key);
  const prefersReducedMotion = useReducedMotion();

  const benefits: BenefitItem[] = [
    {
      icon: Award,
      titleKey: "home.benefits.quality.title",
      descriptionKey: "home.benefits.quality.description",
    },
    {
      icon: Truck,
      titleKey: "home.benefits.direct.title",
      descriptionKey: "home.benefits.direct.description",
    },
    {
      icon: Package,
      titleKey: "home.benefits.packaging.title",
      descriptionKey: "home.benefits.packaging.description",
    },
    {
      icon: Headphones,
      titleKey: "home.benefits.support.title",
      descriptionKey: "home.benefits.support.description",
    },
    {
      icon: Shield,
      titleKey: "home.benefits.standards.title",
      descriptionKey: "home.benefits.standards.description",
    },
    {
      icon: Globe,
      titleKey: "home.benefits.logistics.title",
      descriptionKey: "home.benefits.logistics.description",
    },
  ];

  const benefitFanImages: string[][] = [
    ["/images/home/benefits/benefit-1-1.jpg", "/images/home/benefits/benefit-1-2.jpg", "/images/home/benefits/benefit-1-3.jpg"],
    ["/images/home/benefits/benefit-2-1.jpg", "/images/home/benefits/benefit-2-2.jpg", "/images/home/benefits/benefit-2-3.jpg"],
    ["/images/home/benefits/benefit-3-1.jpg", "/images/home/benefits/benefit-3-2.jpg", "/images/home/benefits/benefit-3-3.jpg"],
    ["/images/home/benefits/benefit-4-1.jpg", "/images/home/benefits/benefit-4-2.jpg", "/images/home/benefits/benefit-4-3.jpg"],
    ["/images/home/benefits/benefit-5-1.jpg", "/images/home/benefits/benefit-5-2.jpg", "/images/home/benefits/benefit-5-3.jpg"],
    ["/images/home/benefits/benefit-6-1.jpg", "/images/home/benefits/benefit-6-2.jpg", "/images/home/benefits/benefit-6-3.jpg"],
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
    },
  };

  return (
    <section className="py-24 sm:py-32 bg-background relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-secondary text-sm font-bold uppercase tracking-widest mb-4">
            {t("home.benefits.badge") || "Why Choose Us"}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
            {t("home.benefits.title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("home.benefits.subtitle")}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {benefits.map((benefit, index) => {
            const fanImages = benefitFanImages[index] ?? [];
            return (
              <motion.div
                key={index}
                variants={itemVariants}
              >
                <BenefitCard
                  benefit={benefit}
                  index={index}
                  title={t(benefit.titleKey)}
                  description={t(benefit.descriptionKey)}
                  fanImages={fanImages}
                  prefersReducedMotion={!!prefersReducedMotion}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
