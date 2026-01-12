"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ship, MapPin, Clock, Package } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getTranslation } from "@/lib/i18n/translations";

interface LogisticsInfo {
  ports?: string[];
  shipping_methods?: string[];
  delivery_time?: string;
  packaging?: string[];
  [key: string]: any;
}

interface ProductLogisticsInfoProps {
  logisticsInfo: LogisticsInfo | null;
  locale: Locale;
}

export function ProductLogisticsInfo({
  logisticsInfo,
  locale,
}: ProductLogisticsInfoProps) {
  const t = (key: string) => getTranslation(locale, key);

  if (!logisticsInfo || Object.keys(logisticsInfo).length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Ship className="h-5 w-5 text-primary" />
          <CardTitle>
            {t("products.logistics") || "Logistics & Shipping"}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logisticsInfo.ports && logisticsInfo.ports.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">
                  {t("products.ports") || "Ports"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {logisticsInfo.ports.map((port: string, idx: number) => (
                  <Badge key={idx} variant="secondary">
                    {port}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {logisticsInfo.shipping_methods &&
            logisticsInfo.shipping_methods.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Ship className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">
                    {t("products.shippingMethods") || "Shipping Methods"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {logisticsInfo.shipping_methods.map(
                    (method: string, idx: number) => (
                      <Badge key={idx} variant="outline">
                        {method}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            )}

          {logisticsInfo.delivery_time && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">
                  {t("products.deliveryTime") || "Delivery Time"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {logisticsInfo.delivery_time}
              </p>
            </div>
          )}

          {logisticsInfo.packaging && logisticsInfo.packaging.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">
                  {t("products.packaging") || "Packaging"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {logisticsInfo.packaging.map((pkg: string, idx: number) => (
                  <Badge key={idx} variant="secondary">
                    {pkg}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

