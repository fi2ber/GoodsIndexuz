"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Package, Globe } from "lucide-react";
import { HSCodeBadge } from "@/components/product/HSCodeBadge";
import type { Locale } from "@/lib/i18n/config";
import { getTranslation } from "@/lib/i18n/translations";

interface ProductBadgesProps {
  hsCode?: string | null;
  moq?: string | null;
  exportReadiness?: string | null;
  origin?: string | null;
  locale: Locale;
}

export function ProductBadges({
  hsCode,
  moq,
  exportReadiness,
  origin,
  locale,
}: ProductBadgesProps) {
  const t = (key: string) => getTranslation(locale, key);

  const badges = [];

  if (hsCode) {
    return (
      <div className="flex flex-wrap gap-2 items-center">
        <HSCodeBadge hsCode={hsCode} variant="default" copyable />
        {moq && (
          <Badge variant="secondary" className="gap-1.5 py-1.5 px-3">
            <Package className="h-3.5 w-3.5" />
            <span className="font-medium">{moq}</span>
          </Badge>
        )}
        {exportReadiness && (
          <Badge variant="default" className="gap-1.5 py-1.5 px-3">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span className="font-medium">{exportReadiness}</span>
          </Badge>
        )}
        {origin && (
          <Badge variant="outline" className="gap-1.5 py-1.5 px-3">
            <Globe className="h-3.5 w-3.5" />
            <span className="font-medium">{origin}</span>
          </Badge>
        )}
      </div>
    );
  }

  if (moq) {
    badges.push({
      label: t("products.moq"),
      value: moq,
      icon: Package,
      variant: "secondary" as const,
    });
  }

  if (exportReadiness) {
    badges.push({
      label: t("products.exportReadiness"),
      value: exportReadiness,
      icon: CheckCircle2,
      variant: "default" as const,
    });
  }

  if (origin) {
    badges.push({
      label: t("products.origin"),
      value: origin,
      icon: Globe,
      variant: "outline" as const,
    });
  }

  if (badges.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <Badge key={index} variant={badge.variant} className="gap-1.5 py-1.5 px-3">
            <Icon className="h-3.5 w-3.5" />
            <span className="font-medium">{badge.value}</span>
          </Badge>
        );
      })}
    </div>
  );
}

