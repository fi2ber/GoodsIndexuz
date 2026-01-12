"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Pencil, Trash2, TrendingUp, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface MarketQuote {
  id: string;
  product_id: string;
  quote_date: string;
  incoterm: string;
  unit: string;
  price_mid_usd: number;
  tolerance_usd: number;
  notes: string | null;
  created_at: string;
}

interface MarketQuotesManagerProps {
  productId: string;
}

export function MarketQuotesManager({ productId }: MarketQuotesManagerProps) {
  const [quotes, setQuotes] = useState<MarketQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<MarketQuote | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Delete confirmation
  const [deleteQuoteId, setDeleteQuoteId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    quote_date: format(new Date(), "yyyy-MM-dd"),
    price_mid_usd: "",
    tolerance_usd: "0.005",
    notes: "",
  });

  const fetchQuotes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/products/${productId}/market-quotes`);
      if (!response.ok) throw new Error("Failed to fetch quotes");
      const data = await response.json();
      setQuotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const handleOpenDialog = (quote?: MarketQuote) => {
    if (quote) {
      setEditingQuote(quote);
      setFormData({
        quote_date: quote.quote_date,
        price_mid_usd: String(quote.price_mid_usd),
        tolerance_usd: String(quote.tolerance_usd),
        notes: quote.notes || "",
      });
    } else {
      setEditingQuote(null);
      setFormData({
        quote_date: format(new Date(), "yyyy-MM-dd"),
        price_mid_usd: "",
        tolerance_usd: "0.005",
        notes: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingQuote(null);
    setError(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        quote_date: formData.quote_date,
        price_mid_usd: parseFloat(formData.price_mid_usd),
        tolerance_usd: parseFloat(formData.tolerance_usd),
        notes: formData.notes || undefined,
      };

      let response: Response;
      if (editingQuote) {
        response = await fetch(`/api/admin/market-quotes/${editingQuote.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(`/api/admin/products/${productId}/market-quotes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save quote");
      }

      await fetchQuotes();
      handleCloseDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteQuoteId) return;

    try {
      const response = await fetch(`/api/admin/market-quotes/${deleteQuoteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete quote");
      }

      await fetchQuotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setDeleteQuoteId(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 3,
      maximumFractionDigits: 5,
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMM dd, yyyy");
    } catch {
      return dateStr;
    }
  };

  // Calculate price change
  const getPriceChange = () => {
    if (quotes.length < 2) return null;
    const latest = Number(quotes[0].price_mid_usd);
    const previous = Number(quotes[1].price_mid_usd);
    const change = latest - previous;
    const percentChange = (change / previous) * 100;
    return { change, percentChange };
  };

  const priceChange = getPriceChange();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Market Index Quotes
            </CardTitle>
            <CardDescription>
              Manage indicative FOB prices (USD/kg) for this product
            </CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Quote
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        {quotes.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Latest Price</p>
              <p className="text-2xl font-bold">
                {formatPrice(Number(quotes[0].price_mid_usd))}
                <span className="text-sm font-normal text-muted-foreground">/kg</span>
              </p>
              <p className="text-xs text-muted-foreground">
                ± {formatPrice(Number(quotes[0].tolerance_usd))}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="text-lg font-medium">{formatDate(quotes[0].quote_date)}</p>
            </div>
            {priceChange && (
              <div>
                <p className="text-sm text-muted-foreground">Change</p>
                <p className={`text-lg font-medium ${priceChange.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {priceChange.change >= 0 ? "+" : ""}
                  {formatPrice(priceChange.change)}
                  <span className="text-sm ml-1">
                    ({priceChange.percentChange >= 0 ? "+" : ""}
                    {priceChange.percentChange.toFixed(2)}%)
                  </span>
                </p>
              </div>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading quotes...</div>
        ) : quotes.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No market quotes yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add your first quote to start tracking prices
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Price (USD/kg)</TableHead>
                  <TableHead>Tolerance</TableHead>
                  <TableHead>Range</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.map((quote) => {
                  const mid = Number(quote.price_mid_usd);
                  const tol = Number(quote.tolerance_usd);
                  return (
                    <TableRow key={quote.id}>
                      <TableCell className="font-medium">
                        {formatDate(quote.quote_date)}
                      </TableCell>
                      <TableCell>{formatPrice(mid)}</TableCell>
                      <TableCell>±{formatPrice(tol)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatPrice(mid - tol)} — {formatPrice(mid + tol)}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {quote.notes || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(quote)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteQuoteId(quote.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingQuote ? "Edit Market Quote" : "Add Market Quote"}
              </DialogTitle>
              <DialogDescription>
                Enter the indicative FOB price (USD/kg) for this product
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="quote_date">Date</Label>
                <Input
                  id="quote_date"
                  type="date"
                  value={formData.quote_date}
                  onChange={(e) =>
                    setFormData({ ...formData, quote_date: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="price_mid_usd">Price (USD/kg)</Label>
                <Input
                  id="price_mid_usd"
                  type="number"
                  step="0.00001"
                  min="0"
                  value={formData.price_mid_usd}
                  onChange={(e) =>
                    setFormData({ ...formData, price_mid_usd: e.target.value })
                  }
                  placeholder="e.g., 3.25"
                  required
                />
              </div>

              <div>
                <Label htmlFor="tolerance_usd">Tolerance (±USD)</Label>
                <Input
                  id="tolerance_usd"
                  type="number"
                  step="0.00001"
                  min="0"
                  value={formData.tolerance_usd}
                  onChange={(e) =>
                    setFormData({ ...formData, tolerance_usd: e.target.value })
                  }
                  placeholder="e.g., 0.005"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Default: ±$0.005 (0.5 cents)
                </p>
              </div>

              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="e.g., Harvest season price adjustment"
                  rows={2}
                />
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                  {error}
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : editingQuote ? "Update" : "Add Quote"}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteQuoteId} onOpenChange={() => setDeleteQuoteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Quote</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this market quote? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
