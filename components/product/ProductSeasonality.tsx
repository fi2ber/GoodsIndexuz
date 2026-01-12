"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import { getTranslation } from "@/lib/i18n/translations";

const months = [
  { num: 1, name: "Jan", fullName: "January" },
  { num: 2, name: "Feb", fullName: "February" },
  { num: 3, name: "Mar", fullName: "March" },
  { num: 4, name: "Apr", fullName: "April" },
  { num: 5, name: "May", fullName: "May" },
  { num: 6, name: "Jun", fullName: "June" },
  { num: 7, name: "Jul", fullName: "July" },
  { num: 8, name: "Aug", fullName: "August" },
  { num: 9, name: "Sep", fullName: "September" },
  { num: 10, name: "Oct", fullName: "October" },
  { num: 11, name: "Nov", fullName: "November" },
  { num: 12, name: "Dec", fullName: "December" },
];

interface ProductSeasonalityProps {
  seasonality: number[];
  locale: Locale;
}

export function ProductSeasonality({
  seasonality,
  locale,
}: ProductSeasonalityProps) {
  const t = (key: string) => getTranslation(locale, key);

  if (!seasonality || seasonality.length === 0) {
    return null;
  }

  const currentMonth = new Date().getMonth() + 1;
  const isAvailableNow = seasonality.includes(currentMonth);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <CardTitle>{t("products.seasonality") || "Product Availability"}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Status */}
          <div className="flex items-center gap-2">
            {isAvailableNow ? (
              <Badge variant="default" className="gap-2">
                <CheckCircle2 className="h-3 w-3" />
                {t("products.availableNow") || "Available Now"}
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-2">
                <Calendar className="h-3 w-3" />
                {t("products.seasonalProduct") || "Seasonal Product"}
              </Badge>
            )}
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
            {months.map((month) => {
              const isAvailable = seasonality.includes(month.num);
              const isCurrent = month.num === currentMonth;
              return (
                <div
                  key={month.num}
                  className={cn(
                    "relative p-3 rounded-lg border-2 text-center transition-all",
                    isAvailable
                      ? "bg-primary/10 border-primary text-primary font-semibold"
                      : "bg-muted/50 border-muted-foreground/20 text-muted-foreground",
                    isCurrent && isAvailable && "ring-2 ring-primary ring-offset-2"
                  )}
                >
                  <div className="text-xs font-bold">{month.name}</div>
                  {isCurrent && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Available Months List */}
          <div className="text-sm text-muted-foreground">
            <p>
              {t("products.availableIn") || "Available in"}:{" "}
              <span className="font-semibold text-primary">
                {seasonality
                  .map((m) => months.find((month) => month.num === m)?.fullName)
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

