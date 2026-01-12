"use client";

import { useEffect } from "react";

interface ProductViewTrackerProps {
  productId: string;
}

export function ProductViewTracker({ productId }: ProductViewTrackerProps) {
  useEffect(() => {
    // Track view only once per page load
    const trackView = async () => {
      try {
        await fetch(`/api/products/${productId}/view`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        // Silently fail - tracking shouldn't break the page
        console.error("Failed to track view:", error);
      }
    };

    trackView();
  }, [productId]);

  return null;
}

