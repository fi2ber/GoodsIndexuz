"use client";

import { motion } from "framer-motion";
import { Shield, MapPin, Package, FileCheck, Clock, Award } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getTranslation } from "@/lib/i18n/translations";

interface TrustProofRowProps {
  locale: Locale;
  variant?: "light" | "dark";
}

const proofItems = [
  { icon: MapPin, labelKey: "home.proof.origin", valueKey: "home.proof.originValue" },
  { icon: Package, labelKey: "home.proof.moq", valueKey: "home.proof.moqValue" },
  { icon: FileCheck, labelKey: "home.proof.certificates", valueKey: "home.proof.certificatesValue" },
  { icon: Clock, labelKey: "home.proof.delivery", valueKey: "home.proof.deliveryValue" },
  { icon: Award, labelKey: "home.proof.quality", valueKey: "home.proof.qualityValue" },
];

export function TrustProofRow({ locale, variant = "light" }: TrustProofRowProps) {
  const t = (key: string) => getTranslation(locale, key);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] },
    },
  };

  const isLight = variant === "light";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-5 gap-2 sm:gap-3 lg:gap-4 mt-8 sm:mt-10 lg:mt-12"
    >
      {proofItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={index}
            variants={itemVariants}
            className={`
              flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl
              backdrop-blur-md border transition-all duration-300
              ${isLight 
                ? "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30" 
                : "bg-primary/5 border-primary/10 hover:bg-primary/10 hover:border-primary/20"
              }
            `}
          >
            <div className={`
              p-1 sm:p-1.5 rounded-lg flex-shrink-0
              ${isLight ? "bg-secondary/90" : "bg-secondary"}
            `}>
              <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isLight ? "text-primary" : "text-primary"}`} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`
                text-[9px] sm:text-[10px] font-medium uppercase tracking-wider truncate
                ${isLight ? "text-white/70" : "text-muted-foreground"}
              `}>
                {t(item.labelKey)}
              </span>
              <span className={`
                text-[10px] sm:text-xs font-bold truncate
                ${isLight ? "text-white" : "text-foreground"}
              `}>
                {t(item.valueKey)}
              </span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

