"use client";

import { Badge } from "@/components/ui/badge";
import { HSCodeBadge } from "@/components/product/HSCodeBadge";
import type { Locale } from "@/lib/i18n/config";
import { getTranslation } from "@/lib/i18n/translations";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/ui/AnimateIn";
import { cn } from "@/lib/utils";
import { 
  Package, 
  MapPin, 
  Tag, 
  Layers, 
  Scale, 
  Clock, 
  Globe, 
  BarChart, 
  Search 
} from "lucide-react";

interface ProductSpecsTableProps {
  hsCode?: string | null;
  grade?: string | null;
  originPlace?: string | null;
  calibers?: string[] | null;
  variety?: string | null;
  origin?: string | null;
  moq?: string | null;
  packaging?: string[] | null;
  shelfLife?: string | null;
  locale: Locale;
}

export function ProductSpecsTable({
  hsCode,
  grade,
  originPlace,
  calibers,
  variety,
  origin,
  moq,
  packaging,
  shelfLife,
  locale,
}: ProductSpecsTableProps) {
  const t = (key: string) => getTranslation(locale, key);

  // Color coding by category
  const getCategoryColor = (label: string) => {
    const labelLower = label.toLowerCase();
    // Technical specs - Blue
    if (labelLower.includes('hs') || labelLower.includes('code') || labelLower.includes('caliber')) {
      return {
        bg: 'bg-blue-50 dark:bg-blue-950/20',
        iconBg: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800',
        hover: 'hover:border-blue-300 dark:hover:border-blue-700',
      };
    }
    // Quality/Grade - Green
    if (labelLower.includes('grade') || labelLower.includes('variety')) {
      return {
        bg: 'bg-green-50 dark:bg-green-950/20',
        iconBg: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
        border: 'border-green-200 dark:border-green-800',
        hover: 'hover:border-green-300 dark:hover:border-green-700',
      };
    }
    // Location/Origin - Orange
    if (labelLower.includes('origin') || labelLower.includes('place')) {
      return {
        bg: 'bg-orange-50 dark:bg-orange-950/20',
        iconBg: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
        border: 'border-orange-200 dark:border-orange-800',
        hover: 'hover:border-orange-300 dark:hover:border-orange-700',
      };
    }
    // Logistics - Purple
    if (labelLower.includes('moq') || labelLower.includes('packaging') || labelLower.includes('shelf')) {
      return {
        bg: 'bg-purple-50 dark:bg-purple-950/20',
        iconBg: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
        border: 'border-purple-200 dark:border-purple-800',
        hover: 'hover:border-purple-300 dark:hover:border-purple-700',
      };
    }
    // Default - Primary
    return {
      bg: 'bg-primary/5',
      iconBg: 'bg-primary/10 text-primary',
      border: 'border-primary/20',
      hover: 'hover:border-primary/30',
    };
  };

  const specs = [
    {
      label: t("products.hsCode"),
      value: hsCode,
      icon: Search,
      component: hsCode ? <HSCodeBadge hsCode={hsCode} copyable /> : null,
      large: true,
    },
    { label: t("products.grade"), icon: Tag, text: grade },
    { label: t("products.originPlace"), value: MapPin, icon: MapPin, text: originPlace },
    {
      label: t("products.calibers"),
      value: Layers,
      icon: Layers,
      large: true,
      component:
        calibers && Array.isArray(calibers) && calibers.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {calibers.map((caliber, idx) => (
              <Badge key={idx} variant="secondary" className="bg-primary/5 hover:bg-primary/10 border-primary/10 text-primary">
                {caliber}
              </Badge>
            ))}
          </div>
        ) : null,
    },
    { label: t("products.variety"), value: Package, icon: Package, text: variety },
    { label: t("products.origin"), value: Globe, icon: Globe, text: origin },
    { label: t("products.moq"), value: Scale, icon: Scale, text: moq },
    { label: t("products.shelfLife"), value: Clock, icon: Clock, text: shelfLife },
    { 
      label: t("products.packaging"), 
      value: BarChart, 
      icon: Package, 
      text: packaging && Array.isArray(packaging) && packaging.length > 0 ? packaging.join(", ") : null 
    },
  ].filter((spec) => spec.text || spec.component);

  if (specs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <AnimateIn>
        <h3 className="text-2xl font-bold tracking-tight mb-6">
          {t("products.specifications")}
        </h3>
      </AnimateIn>
      
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {specs.map((spec, index) => {
          const Icon = spec.icon;
          const colors = getCategoryColor(spec.label);
          return (
            <StaggerItem 
              key={index}
              className={cn(
                "p-6 rounded-3xl border-2 transition-all duration-300 hover:shadow-xl group cursor-default",
                colors.bg,
                colors.border,
                colors.hover,
                spec.large ? "md:col-span-2" : "md:col-span-1"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-3 rounded-2xl transition-all duration-300 flex-shrink-0",
                  colors.iconBg,
                  "group-hover:scale-110"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                    {spec.label}
                  </p>
                  <div className="text-lg font-bold text-foreground break-words">
                    {spec.component || spec.text || "—"}
                  </div>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </div>
  );
}

