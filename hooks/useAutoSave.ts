import { useEffect, useRef } from "react";

interface UseAutoSaveOptions {
  data: Record<string, any>;
  productId?: string;
  enabled?: boolean;
  debounceMs?: number;
}

export function useAutoSave({
  data,
  productId,
  enabled = true,
  debounceMs = 2000,
}: UseAutoSaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>("");
  const draftKey = `product-draft-${productId || "new"}`;

  useEffect(() => {
    if (!enabled) return;

    const dataString = JSON.stringify(data);
    
    // Пропускаем если данные не изменились
    if (dataString === lastSavedRef.current) {
      return;
    }

    // Очищаем предыдущий timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Устанавливаем новый timeout
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(draftKey, dataString);
        lastSavedRef.current = dataString;
      } catch (error) {
        console.error("Failed to save draft:", error);
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, draftKey, debounceMs, enabled]);

  const clearDraft = () => {
    try {
      localStorage.removeItem(draftKey);
      lastSavedRef.current = "";
    } catch (error) {
      console.error("Failed to clear draft:", error);
    }
  };

  const restoreDraft = (): Record<string, any> | null => {
    try {
      const draft = localStorage.getItem(draftKey);
      if (draft) {
        return JSON.parse(draft);
      }
    } catch (error) {
      console.error("Failed to restore draft:", error);
    }
    return null;
  };

  return {
    clearDraft,
    restoreDraft,
  };
}

