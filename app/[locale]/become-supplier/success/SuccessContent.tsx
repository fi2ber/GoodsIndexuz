"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, XCircle, AlertCircle, Copy, Check, ArrowRight, Home, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/hooks";
import type { Locale } from "@/lib/i18n/config";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SubmissionStatus {
  id: string;
  status: "pending" | "approved" | "rejected" | "needs_revision";
  rejection_reason: string | null;
  created_at: string;
  reviewed_at: string | null;
  product_name_ru?: string;
  product_name_en?: string;
}

export function SuccessContent({ token, locale }: { token?: string; locale: Locale }) {
  const t = useTranslation(locale);
  const [status, setStatus] = useState<SubmissionStatus | null>(null);
  const [loading, setLoading] = useState(!!token);
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>("");

  useEffect(() => {
    // Set current URL only on client side
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }

    if (token) {
      fetch(`/api/product-submissions/${token}?token=${token}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setStatus(data);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [token]);

  const copyLink = () => {
    if (typeof window !== "undefined" && currentUrl) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const statusConfig = {
    pending: { 
      label: t("submission.statusPending"), 
      icon: Clock, 
      color: "text-yellow-600", 
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      badge: "bg-yellow-100 text-yellow-800"
    },
    approved: { 
      label: t("submission.statusApproved"), 
      icon: CheckCircle2, 
      color: "text-green-600", 
      bg: "bg-green-50",
      border: "border-green-200",
      badge: "bg-green-100 text-green-800"
    },
    rejected: { 
      label: t("submission.statusRejected"), 
      icon: XCircle, 
      color: "text-red-600", 
      bg: "bg-red-50",
      border: "border-red-200",
      badge: "bg-red-100 text-red-800"
    },
    needs_revision: { 
      label: t("submission.statusRevision"), 
      icon: AlertCircle, 
      color: "text-orange-600", 
      bg: "bg-orange-50",
      border: "border-orange-200",
      badge: "bg-orange-100 text-orange-800"
    },
  };

  const currentStatus = status?.status || "pending";
  const config = statusConfig[currentStatus as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card className="border-none shadow-xl bg-background/50 backdrop-blur-sm overflow-hidden rounded-[2.5rem]">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary" />
        
        <CardHeader className="text-center pt-12 pb-8">
          <div className="mx-auto mb-6 w-20 h-20 bg-green-50 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            {t("submission.successTitle")}
          </CardTitle>
          <CardDescription className="text-lg">
            {t("submission.successSubtitle")}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 sm:px-12 pb-12 space-y-8">
          <div className="bg-muted/30 rounded-3xl p-6 sm:p-8 space-y-6">
            <p className="text-center text-muted-foreground leading-relaxed">
              {t("submission.success")}
            </p>

            {token && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{t("submission.currentStatus")}</h3>
                  {loading ? (
                    <Badge variant="outline" className="animate-pulse">{t("common.loading")}</Badge>
                  ) : (
                    <Badge className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider", config.badge)}>
                      {config.label}
                    </Badge>
                  )}
                </div>

                {!loading && (
                  <div className={cn("p-5 rounded-2xl border transition-all", config.bg, config.border)}>
                    <div className="flex items-start gap-4">
                      <div className={cn("p-2 rounded-xl bg-white shadow-sm", config.color)}>
                        <StatusIcon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-lg leading-tight mb-1">{config.label}</p>
                        <p className="text-sm opacity-80">
                          {currentStatus === "pending" && t("submission.statusPendingDesc")}
                          {currentStatus === "approved" && t("submission.statusApprovedDesc")}
                          {currentStatus === "rejected" && t("submission.statusRejectedDesc")}
                          {currentStatus === "needs_revision" && t("submission.statusRevisionDesc")}
                        </p>
                        {status?.rejection_reason && (
                          <div className="mt-3 p-3 bg-white/50 rounded-lg text-sm border border-black/5">
                            <p className="font-semibold mb-1">{t("submission.rejectionReason")}</p>
                            <p>{status.rejection_reason}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-xl text-center">{t("submission.whatNext")}</h3>
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 items-start p-4 rounded-2xl bg-background border hover:border-primary/20 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold flex-shrink-0">
                    {i}
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground pt-1">
                    {t(`submission.nextStep${i}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="flex-1">
                <p className="font-semibold mb-1">{t("submission.saveLink")}</p>
                {currentUrl ? (
                  <p className="text-xs text-muted-foreground break-all">
                    {currentUrl}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground break-all">
                    {t("common.loading")}
                  </p>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl h-10 px-4 flex-shrink-0"
                onClick={copyLink}
              >
                {copied ? (
                  <><Check className="w-4 h-4 mr-2" /> {t("common.copied")}</>
                ) : (
                  <><Copy className="w-4 h-4 mr-2" /> {t("common.copyLink")}</>
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href={`/${locale}/become-supplier`} className="flex-1">
              <Button variant="outline" className="w-full rounded-2xl h-14 font-semibold text-lg hover:bg-secondary/5">
                <PlusCircle className="w-5 h-5 mr-2" />
                {t("submission.submitAnother")}
              </Button>
            </Link>
            <Link href={`/${locale}`} className="flex-1">
              <Button className="w-full rounded-2xl h-14 font-bold text-lg bg-primary hover:bg-primary/90 shadow-lg group">
                <Home className="w-5 h-5 mr-2" />
                {t("submission.backToHome")}
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

