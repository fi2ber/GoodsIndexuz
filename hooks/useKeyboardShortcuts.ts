import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface UseKeyboardShortcutsOptions {
  onSave?: () => void;
  onCancel?: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcuts({
  onSave,
  onCancel,
  enabled = true,
}: UseKeyboardShortcutsOptions) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + S - Save
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (onSave) {
          onSave();
        }
        return;
      }

      // Esc - Cancel
      if (e.key === "Escape") {
        if (onCancel) {
          onCancel();
        } else {
          router.back();
        }
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onSave, onCancel, enabled, router]);
}

