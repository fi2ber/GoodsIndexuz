"use client";

import { ProductSubmissionForm } from "./ProductSubmissionForm";
import type { Locale } from "@/lib/i18n/config";
import type { Database } from "@/types/database";

type Category = Database["public"]["Tables"]["categories"]["Row"];

interface BecomeSupplierClientProps {
  categories: Category[];
  locale: Locale;
}

export function BecomeSupplierClient({ categories, locale }: BecomeSupplierClientProps) {
  const handleSubmit = async (data: any) => {
    const response = await fetch("/api/product-submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        packaging_options: data.packaging_options
          ? data.packaging_options.split("\n").filter((line: string) => line.trim())
          : [],
      }),
    });

    if (!response.ok) {
      // Проверяем Content-Type перед парсингом JSON
      const contentType = response.headers.get("content-type");
      let errorMessage = "Failed to submit product";
      
      if (contentType && contentType.includes("application/json")) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (parseError) {
          // Если не удалось распарсить JSON, используем дефолтное сообщение
          console.error("Failed to parse error response:", parseError);
        }
      } else {
        // Если ответ не JSON, используем статус код
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    const result = await response.json();
    // Redirect to success page or show success message
    window.location.href = `/${locale}/become-supplier/success?token=${result.access_token}`;
  };

  return (
    <ProductSubmissionForm
      categories={categories}
      locale={locale}
      onSubmit={handleSubmit}
    />
  );
}

