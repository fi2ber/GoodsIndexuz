"use client";

import { getTranslation } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/config";
import { TrendingUp, Globe, Package, Users } from "lucide-react";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/ui/AnimateIn";
import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

interface StatsSectionProps {
  locale: Locale;
}

function Counter({ value, duration = 2 }: { value: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  // Extract number from string like "5000+"
  const target = parseInt(value.replace(/\D/g, ""));
  const suffix = value.replace(/[0-9]/g, "");

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = target;
      if (start === end) return;

      let totalMiliseconds = duration * 1000;
      let incrementTime = (totalMiliseconds / end);

      let timer = setInterval(() => {
        start += Math.ceil(end / 60);
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 1000 / 60);

      return () => clearInterval(timer);
    }
  }, [isInView, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export function StatsSection({ locale }: StatsSectionProps) {
  const t = (key: string) => getTranslation(locale, key);

  const stats = [
    {
      icon: TrendingUp,
      value: "10+",
      labelKey: "home.stats.years",
    },
    {
      icon: Package,
      value: "5000+",
      labelKey: "home.stats.tons",
    },
    {
      icon: Globe,
      value: "25+",
      labelKey: "home.stats.countries",
    },
    {
      icon: Users,
      value: "100+",
      labelKey: "home.stats.clients",
    },
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Abstract background shapes in Modern Silk Road palette */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-40 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[80%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[80%] rounded-full bg-secondary/20 blur-[140px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <StaggerItem key={index} className="text-center group">
                <div className="flex justify-center mb-6 transition-transform duration-500 group-hover:scale-110">
                  <div className="rounded-2xl bg-secondary/10 p-4 backdrop-blur-sm border border-secondary/20">
                    <Icon className="h-8 w-8 text-secondary" />
                  </div>
                </div>
                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight text-primary">
                  <Counter value={stat.value} />
                </div>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-medium uppercase tracking-widest">
                  {t(stat.labelKey)}
                </p>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}

