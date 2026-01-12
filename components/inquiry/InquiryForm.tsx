"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/lib/i18n/hooks";
import type { Locale } from "@/lib/i18n/config";
import { Send } from "lucide-react";
import { ContactOptions } from "./ContactOptions";

const inquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().optional(),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

interface InquiryFormProps {
  productId?: string;
  locale: Locale;
}

export function InquiryForm({ productId, locale }: InquiryFormProps) {
  const t = useTranslation(locale);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [managerContacts, setManagerContacts] = useState<{
    telegram_link: string | null;
    whatsapp_link: string | null;
    email: string | null;
    email_link: string | null;
    phone: string | null;
    phone_link: string | null;
    name: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
  });

  const onSubmit = async (data: InquiryFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Get default manager
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: data.name,
          customer_email: data.email || null,
          customer_phone: data.phone || null,
          customer_company: data.company || null,
          message: data.message || null,
          product_id: productId || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.error || "Failed to submit inquiry");
      }

      const result = await response.json();
      setSuccess(true);
      reset();

      // Store manager contacts for display
      if (result.manager_contacts) {
        setManagerContacts(result.manager_contacts);
      }
    } catch (err) {
      setError(t("inquiry.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success && managerContacts) {
    return (
      <div className="space-y-4">
        <div className="text-center py-4">
          <p className="text-green-600 font-medium mb-2">{t("inquiry.success")}</p>
        </div>
        <ContactOptions contacts={managerContacts} locale={locale} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">{t("common.name")} *</Label>
        <Input
          id="name"
          {...register("name")}
          className="mt-1"
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">{t("common.email")}</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          className="mt-1"
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="phone">{t("common.phone")}</Label>
        <Input
          id="phone"
          type="tel"
          {...register("phone")}
          className="mt-1"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="company">{t("common.company")}</Label>
        <Input
          id="company"
          {...register("company")}
          className="mt-1"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="message">{t("common.message")}</Label>
        <Textarea
          id="message"
          {...register("message")}
          className="mt-1"
          rows={4}
          disabled={isSubmitting}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          t("common.loading")
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            {t("common.requestPrice")}
          </>
        )}
      </Button>
    </form>
  );
}

