"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/hooks";
import { Button } from "@/components/ui/button";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface HeaderProps {
  locale: Locale;
}

export function Header({ locale }: HeaderProps) {
  const t = useTranslation(locale);
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const switchLocale = (newLocale: Locale) => {
    // Save locale preference in cookie
    document.cookie = `locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    
    const currentPath = pathname || `/${locale}`;
    let newPath = currentPath;
    
    // Replace locale in path
    if (currentPath.startsWith(`/${locale}/`)) {
      newPath = currentPath.replace(`/${locale}/`, `/${newLocale}/`);
    } else if (currentPath === `/${locale}`) {
      newPath = `/${newLocale}`;
    } else {
      newPath = `/${newLocale}${currentPath}`;
    }
    
    window.location.href = newPath;
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 transition-all duration-300 border-b",
      isScrolled 
        ? "bg-background/80 backdrop-blur-md py-2 border-border" 
        : "bg-transparent py-4 border-transparent"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href={`/${locale}`} className="text-xl font-bold tracking-tight text-primary">
              GoodsIndex<span className="text-secondary">uz</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href={`/${locale}`}
                className="text-sm font-semibold transition-colors hover:text-secondary"
              >
                {t("common.home")}
              </Link>
              <Link
                href={`/${locale}/products`}
                className="text-sm font-semibold transition-colors hover:text-secondary"
              >
                {t("common.products")}
              </Link>
              <Link
                href={`/${locale}/about`}
                className="text-sm font-semibold transition-colors hover:text-secondary"
              >
                {t("common.about")}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="text-sm font-semibold transition-colors hover:text-secondary"
              >
                {t("common.contact")}
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-full">
              <Button
                variant={locale === "en" ? "default" : "ghost"}
                size="sm"
                className="rounded-full px-4 h-8"
                onClick={() => switchLocale("en")}
              >
                EN
              </Button>
              <Button
                variant={locale === "ru" ? "default" : "ghost"}
                size="sm"
                className="rounded-full px-4 h-8"
                onClick={() => switchLocale("ru")}
              >
                RU
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

