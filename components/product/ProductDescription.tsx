"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProductDescriptionProps {
  description: string;
  className?: string;
}

export function ProductDescription({
  description,
  className,
}: ProductDescriptionProps) {
  if (!description || description.trim().length === 0) {
    return null;
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-2xl">Description</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {description}
        </div>
      </CardContent>
    </Card>
  );
}

