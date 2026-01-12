"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function FxRateForm() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    rate_date: new Date().toISOString().split("T")[0],
    usd_uzs: "",
    source: "manual",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/fx-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rate_date: formData.rate_date,
          usd_uzs: parseFloat(formData.usd_uzs),
          source: formData.source,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save exchange rate");
      }

      setOpen(false);
      router.refresh();
      setFormData({
        rate_date: new Date().toISOString().split("T")[0],
        usd_uzs: "",
        source: "manual",
      });
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Rate
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Exchange Rate</DialogTitle>
            <DialogDescription>
              Manually add or update USD/UZS exchange rate for a specific date.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="rate_date">Date</Label>
              <Input
                id="rate_date"
                type="date"
                value={formData.rate_date}
                onChange={(e) =>
                  setFormData({ ...formData, rate_date: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="usd_uzs">USD/UZS Rate</Label>
              <Input
                id="usd_uzs"
                type="number"
                step="0.01"
                min="0"
                value={formData.usd_uzs}
                onChange={(e) =>
                  setFormData({ ...formData, usd_uzs: e.target.value })
                }
                placeholder="e.g., 12500.00"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter the exchange rate (1 USD = X UZS)
              </p>
            </div>
            <div>
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                type="text"
                value={formData.source}
                onChange={(e) =>
                  setFormData({ ...formData, source: e.target.value })
                }
                placeholder="e.g., manual, CBU, etc."
              />
            </div>
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                {error}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Rate"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
