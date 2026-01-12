"use client";

import { getTranslation } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/config";
import { MessageSquare, Handshake, FileText, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProcessSectionProps {
  locale: Locale;
}

interface ProcessStep {
  icon: React.ComponentType<{ className?: string }>;
  stepKey: string;
  titleKey: string;
  descriptionKey: string;
}

export function ProcessSection({ locale }: ProcessSectionProps) {
  const t = (key: string) => getTranslation(locale, key);

  const steps: ProcessStep[] = [
    {
      icon: MessageSquare,
      stepKey: "home.process.step1",
      titleKey: "home.process.step1Title",
      descriptionKey: "home.process.step1Description",
    },
    {
      icon: Handshake,
      stepKey: "home.process.step2",
      titleKey: "home.process.step2Title",
      descriptionKey: "home.process.step2Description",
    },
    {
      icon: FileText,
      stepKey: "home.process.step3",
      titleKey: "home.process.step3Title",
      descriptionKey: "home.process.step3Description",
    },
    {
      icon: Truck,
      stepKey: "home.process.step4",
      titleKey: "home.process.step4Title",
      descriptionKey: "home.process.step4Description",
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-muted/30 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,transparent_49%,hsl(var(--border)/0.3)_50%,transparent_51%,transparent_100%)] bg-[size:100px_100%] pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          <span className="inline-block text-secondary text-sm font-bold uppercase tracking-widest mb-4">
            {t("home.process.badge") || "How It Works"}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
            {t("home.process.title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("home.process.subtitle")}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-[72px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="relative group"
                >
                  {/* Step card */}
                  <div className="text-center">
                    {/* Icon with number */}
                    <div className="relative inline-flex flex-col items-center mb-6">
                      {/* Icon circle */}
                      <div className={cn(
                        "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500",
                        "bg-background border-2 border-secondary/30 shadow-lg",
                        "group-hover:border-secondary group-hover:shadow-xl group-hover:scale-110"
                      )}>
                        <Icon className="h-8 w-8 text-secondary" />
                      </div>
                      {/* Step number */}
                      <div className={cn(
                        "absolute -bottom-2 left-1/2 -translate-x-1/2",
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        "bg-secondary text-primary text-sm font-bold shadow-md",
                        "transition-all duration-300 group-hover:scale-110"
                      )}>
                        {index + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold mb-3 tracking-tight group-hover:text-secondary transition-colors">
                      {t(step.titleKey)}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                      {t(step.descriptionKey)}
                    </p>
                  </div>

                  {/* Mobile/tablet connector */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center my-6">
                      <div className="w-0.5 h-8 bg-secondary/30" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
