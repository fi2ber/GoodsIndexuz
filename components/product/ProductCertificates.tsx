"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Award, ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import { getTranslation } from "@/lib/i18n/translations";

export interface Certificate {
  name: string;
  image_url: string;
  id?: string;
}

interface ProductCertificatesProps {
  certificates: Certificate[];
  locale: Locale;
}

export function ProductCertificates({
  certificates,
  locale,
}: ProductCertificatesProps) {
  const t = (key: string) => getTranslation(locale, key);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!certificates || certificates.length === 0) {
    return null;
  }

  const handlePrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(
        selectedIndex === 0 ? certificates.length - 1 : selectedIndex - 1
      );
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(
        selectedIndex === certificates.length - 1 ? 0 : selectedIndex + 1
      );
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <CardTitle>
              {t("products.certificates") || "Certificates & Quality Standards"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {certificates.map((cert, index) => (
              <button
                key={cert.id || index}
                onClick={() => setSelectedIndex(index)}
                className="group relative aspect-square rounded-lg overflow-hidden border-2 border-muted hover:border-primary transition-all hover:shadow-lg"
              >
                <Image
                  src={cert.image_url}
                  alt={cert.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-2 transform translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-xs font-semibold text-white line-clamp-2">
                    {cert.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certificate Lightbox */}
      <Dialog
        open={selectedIndex !== null}
        onOpenChange={(open) => !open && setSelectedIndex(null)}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedIndex !== null && certificates[selectedIndex]?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedIndex !== null && (
            <div className="relative">
              <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted">
                <Image
                  src={certificates[selectedIndex].image_url}
                  alt={certificates[selectedIndex].name}
                  fill
                  className="object-contain"
                />
              </div>
              {certificates.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    onClick={handlePrevious}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    onClick={handleNext}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {selectedIndex + 1} / {certificates.length}
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

