"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageCircle, Phone, Mail, PhoneCall, Copy, Check } from "lucide-react";
import { useTranslation } from "@/lib/i18n/hooks";
import type { Locale } from "@/lib/i18n/config";

interface ContactOptionsProps {
  contacts: {
    telegram_link: string | null;
    whatsapp_link: string | null;
    email: string | null;
    email_link: string | null;
    phone: string | null;
    phone_link: string | null;
    name: string;
  };
  locale: Locale;
}

export function ContactOptions({ contacts, locale }: ContactOptionsProps) {
  const t = useTranslation(locale);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyEmail = () => {
    if (contacts.email) {
      navigator.clipboard.writeText(contacts.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleCopyPhone = () => {
    if (contacts.phone) {
      navigator.clipboard.writeText(contacts.phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const availableContacts = [
    {
      id: "telegram",
      label: t("inquiry.contactViaTelegram"),
      icon: MessageCircle,
      link: contacts.telegram_link,
      variant: "default" as const,
      available: !!contacts.telegram_link,
    },
    {
      id: "whatsapp",
      label: t("inquiry.contactViaWhatsApp"),
      icon: Phone,
      link: contacts.whatsapp_link,
      variant: "default" as const,
      available: !!contacts.whatsapp_link,
    },
    {
      id: "email",
      label: t("inquiry.contactViaEmail"),
      icon: Mail,
      link: contacts.email_link,
      variant: "secondary" as const,
      available: !!contacts.email,
      copyAction: handleCopyEmail,
      copyLabel: t("inquiry.copyEmail"),
      copied: copiedEmail,
    },
    {
      id: "phone",
      label: t("inquiry.contactViaPhone"),
      icon: PhoneCall,
      link: contacts.phone_link,
      variant: "secondary" as const,
      available: !!contacts.phone,
      copyAction: handleCopyPhone,
      copyLabel: t("inquiry.copyPhone"),
      copied: copiedPhone,
    },
  ].filter((contact) => contact.available);

  if (availableContacts.length === 0) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{t("inquiry.contactManager")}</CardTitle>
        <CardDescription>{t("inquiry.chooseContactMethod")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {availableContacts.map((contact) => {
            const Icon = contact.icon;
            return (
              <div key={contact.id} className="flex gap-2">
                {contact.link ? (
                  <Button
                    variant={contact.variant}
                    className="flex-1 justify-start gap-2"
                    onClick={() => {
                      if (contact.link) {
                        window.open(contact.link, "_blank");
                      }
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="flex-1 text-left">{contact.label}</span>
                  </Button>
                ) : (
                  <Button
                    variant={contact.variant}
                    className="flex-1 justify-start gap-2"
                    disabled
                  >
                    <Icon className="h-4 w-4" />
                    <span className="flex-1 text-left">{contact.label}</span>
                  </Button>
                )}
                {contact.copyAction && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={contact.copyAction}
                    title={contact.copied ? t("inquiry.emailCopied") || t("inquiry.phoneCopied") : contact.copyLabel}
                    className="shrink-0"
                  >
                    {contact.copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

