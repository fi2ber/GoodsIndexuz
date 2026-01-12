"use client";

import { useState } from "react";
import { Copy, Check, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface HSCodeBadgeProps {
  hsCode: string;
  className?: string;
  variant?: "default" | "secondary" | "outline";
  showIcon?: boolean;
  copyable?: boolean;
}

export function HSCodeBadge({
  hsCode,
  className,
  variant = "default",
  showIcon = true,
  copyable = true,
}: HSCodeBadgeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!copyable) return;
    try {
      await navigator.clipboard.writeText(hsCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  if (!hsCode) {
    return null;
  }

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <Badge
        variant={variant}
        className={cn(
          "gap-1.5 py-1.5 px-3 font-mono",
          copyable && "cursor-pointer hover:opacity-80 transition-opacity"
        )}
        onClick={handleCopy}
        title={copyable ? (copied ? "HS Code copied!" : "Click to copy HS Code") : "HS Code (Harmonized System Code)"}
      >
        {showIcon && <FileText className="h-3.5 w-3.5" />}
        <span>{hsCode}</span>
        {copyable && (
          <span className="ml-1">
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-600" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </span>
        )}
      </Badge>
    </div>
  );
}

