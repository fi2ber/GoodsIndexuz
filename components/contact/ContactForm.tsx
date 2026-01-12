"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Locale } from "@/lib/i18n/config";
import { useTranslation } from "@/lib/i18n/hooks";

const schema = z.object({
  name: z.string().min(1),
  company: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

export function ContactForm({ locale }: { locale: Locale }) {
  const t = useTranslation(locale);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      subject: t("contactPage.form.subjectPlaceholder"),
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: data.name,
          customer_company: data.company || null,
          customer_email: data.email || null,
          customer_phone: data.phone || null,
          subject: data.subject,
          message: data.message,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Failed to send message");
      }

      setSuccess(true);
      reset();
    } catch (e: any) {
      setError(t("contactPage.form.sendFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-md border p-4 text-sm">
        <p className="font-medium">
          {t("contactPage.form.success")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">{t("common.name")} *</Label>
          <Input id="name" {...register("name")} className="mt-1" disabled={isSubmitting} />
          {errors.name && <p className="text-sm text-destructive mt-1">{t("contactPage.form.nameRequired")}</p>}
        </div>
        <div>
          <Label htmlFor="company">{t("common.company")}</Label>
          <Input id="company" {...register("company")} className="mt-1" disabled={isSubmitting} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">{t("common.email")}</Label>
          <Input id="email" type="email" {...register("email")} className="mt-1" disabled={isSubmitting} />
        </div>
        <div>
          <Label htmlFor="phone">{t("common.phone")}</Label>
          <Input id="phone" type="tel" {...register("phone")} className="mt-1" disabled={isSubmitting} />
        </div>
      </div>

      <div>
        <Label htmlFor="subject">{t("contactPage.form.subject")} *</Label>
        <Input id="subject" {...register("subject")} className="mt-1" disabled={isSubmitting} />
        {errors.subject && <p className="text-sm text-destructive mt-1">{t("contactPage.form.subjectRequired")}</p>}
      </div>

      <div>
        <Label htmlFor="message">{t("common.message")} *</Label>
        <Textarea id="message" rows={5} {...register("message")} className="mt-1" disabled={isSubmitting} />
        {errors.message && <p className="text-sm text-destructive mt-1">{t("contactPage.form.messageRequired")}</p>}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? t("contactPage.form.sending") : t("contactPage.form.send")}
      </Button>
    </form>
  );
}


