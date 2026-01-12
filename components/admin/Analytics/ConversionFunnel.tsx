"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ConversionFunnelProps {
  total: number;
  contacted: number;
  closed: number;
}

export function ConversionFunnel({
  total,
  contacted,
  closed,
}: ConversionFunnelProps) {
  const contactedPercent = total > 0 ? ((contacted / total) * 100).toFixed(1) : "0";
  const closedPercent = total > 0 ? ((closed / total) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Total Inquiries</span>
          <span className="text-sm font-bold">{total}</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary"
            style={{ width: "100%" }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Contacted</span>
          <span className="text-sm font-bold">
            {contacted} ({contactedPercent}%)
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-500"
            style={{ width: `${contactedPercent}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Closed</span>
          <span className="text-sm font-bold">
            {closed} ({closedPercent}%)
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500"
            style={{ width: `${closedPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

