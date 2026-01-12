import { getTranslation } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/config";
import { MapPin, Sun, Leaf } from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/ui/AnimateIn";

interface OriginSectionProps {
  locale: Locale;
}

export function OriginSection({ locale }: OriginSectionProps) {
  const t = (key: string) => getTranslation(locale, key);

  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Text Content */}
          <AnimateIn direction="left">
            <h2 className="text-4xl sm:text-5xl font-bold mb-8 tracking-tight">
              {t("home.origin.title")}
            </h2>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              {t("home.origin.description")}
            </p>

            <StaggerContainer className="space-y-8" staggerTime={0.2}>
              <StaggerItem>
                <div className="flex items-start gap-6 group">
                  <div className="rounded-2xl bg-secondary/10 p-4 transition-colors group-hover:bg-secondary group-hover:text-white">
                    <Sun className="h-6 w-6 text-secondary group-hover:text-inherit" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">{t("home.origin.climate.title")}</h3>
                    <p className="text-muted-foreground leading-relaxed">{t("home.origin.climate.description")}</p>
                  </div>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="flex items-start gap-6 group">
                  <div className="rounded-2xl bg-secondary/10 p-4 transition-colors group-hover:bg-secondary group-hover:text-white">
                    <Leaf className="h-6 w-6 text-secondary group-hover:text-inherit" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">{t("home.origin.quality.title")}</h3>
                    <p className="text-muted-foreground leading-relaxed">{t("home.origin.quality.description")}</p>
                  </div>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="flex items-start gap-6 group">
                  <div className="rounded-2xl bg-secondary/10 p-4 transition-colors group-hover:bg-secondary group-hover:text-white">
                    <MapPin className="h-6 w-6 text-secondary group-hover:text-inherit" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">{t("home.origin.region.title")}</h3>
                    <p className="text-muted-foreground leading-relaxed">{t("home.origin.region.description")}</p>
                  </div>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </AnimateIn>

          {/* Images with premium feel */}
          <AnimateIn direction="right" className="grid grid-cols-2 gap-6">
            <div className="relative h-72 rounded-3xl overflow-hidden shadow-2xl translate-y-8">
              <ImageWithFallback
                src="/images/home/origin/field.jpg"
                alt="Agricultural field in Uzbekistan"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 25vw"
                placeholderText="Field"
              />
            </div>
            <div className="relative h-72 rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="/images/home/origin/processing.jpg"
                alt="Product processing"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 25vw"
                placeholderText="Processing"
              />
            </div>
            <div className="relative h-80 rounded-3xl overflow-hidden col-span-2 shadow-2xl translate-y-4">
              <ImageWithFallback
                src="/images/home/origin/landscape.jpg"
                alt="Uzbekistan landscape"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                placeholderText="Landscape"
              />
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}

