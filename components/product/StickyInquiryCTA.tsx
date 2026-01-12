"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useTranslation } from "@/lib/i18n/hooks";
import type { Locale } from "@/lib/i18n/config";

interface StickyInquiryCTAProps {
  locale: Locale;
}

export function StickyInquiryCTA({ locale }: StickyInquiryCTAProps) {
  const t = useTranslation(locale);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Показываем CTA только на мобильных (< 1024px)
      if (window.innerWidth < 1024) {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Показываем если прокрутили больше 200px и не достигли формы
        // Скрываем если достигли формы или в самом верху
        const inquiryForm = document.getElementById("inquiry-form");
        if (inquiryForm) {
          const formTop = inquiryForm.getBoundingClientRect().top + window.scrollY;
          setIsVisible(scrollPosition > 200 && scrollPosition < formTop - windowHeight);
        } else {
          setIsVisible(scrollPosition > 200);
        }
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    const inquiryForm = document.getElementById("inquiry-form");
    if (inquiryForm) {
      inquiryForm.scrollIntoView({ behavior: "smooth", block: "start" });
      // Небольшая задержка для плавного скролла
      setTimeout(() => {
        const firstInput = inquiryForm.querySelector("input");
        if (firstInput) {
          firstInput.focus();
        }
      }, 500);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="bg-background border-t shadow-lg p-4">
        <Button
          onClick={handleClick}
          className="w-full"
          size="lg"
        >
          <Send className="mr-2 h-4 w-4" />
          {t("common.requestPriceViaTelegram")}
        </Button>
      </div>
    </div>
  );
}

