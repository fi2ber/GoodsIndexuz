"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/hooks";
import type { Locale } from "@/lib/i18n/config";

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  const t = useTranslation(locale);

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">GoodsIndexuz</h3>
            <p className="text-sm text-muted-foreground">
              {t("common.tagline")}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">{t("common.products")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{t("footer.categories.nuts")}</li>
              <li>{t("footer.categories.legumes")}</li>
              <li>{t("footer.categories.driedFruits")}</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">{t("common.company")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("common.about")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/certificates`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("common.certificates")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/process`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("common.process")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/quality`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("common.quality")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/logistics`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("common.logistics")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/cases`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("common.cases")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/terms`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("common.terms")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("common.contact")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">
              {t("common.forSuppliers")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={`/${locale}/become-supplier`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("submission.title")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">{t("common.contact")}</h4>
            <p className="text-sm text-muted-foreground">
              {t("common.contactViaTelegram")}
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} GoodsIndexuz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

