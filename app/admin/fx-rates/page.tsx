import { getAllFxRates, getLatestFxRate } from "@/lib/db/queries";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react";
import { FxRateForm } from "@/components/admin/FxRateForm";
import { UpdateFxRateButton } from "@/components/admin/UpdateFxRateButton";

export default async function AdminFxRatesPage() {
  let rates: any[] = [];
  let latestRate: any = null;
  let error: string | null = null;

  try {
    rates = await getAllFxRates(100); // Последние 100 записей
    latestRate = await getLatestFxRate();
  } catch (err: any) {
    console.error("Error loading FX rates:", err);
    error = err.message || "Failed to load exchange rates";
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exchange Rates (USD/UZS)</h1>
          <p className="text-muted-foreground">
            Manage daily USD to UZS exchange rates
          </p>
        </div>
        <div className="flex gap-2">
          <FxRateForm />
          <UpdateFxRateButton />
        </div>
      </div>

      {error && (
        <div className="border border-destructive/50 rounded-lg p-4 bg-destructive/10">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <div>
              <p className="font-medium">Error loading exchange rates</p>
              <p className="text-sm">{error}</p>
              <p className="text-xs mt-2">
                Make sure migration 013_create_market_index.sql has been run.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Latest Rate Card */}
      {latestRate && (
        <div className="border rounded-lg p-6 bg-muted/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Latest Rate</p>
              <p className="text-3xl font-bold">
                1 USD = {Number(latestRate.usd_uzs).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                UZS
              </p>
              <div className="text-sm text-muted-foreground mt-1">
                Date: {format(new Date(latestRate.rate_date), "MMMM dd, yyyy")}
                {latestRate.source && (
                  <span className="ml-2">
                    • Source: <Badge variant="outline">{latestRate.source}</Badge>
                  </span>
                )}
              </div>
            </div>
            {rates.length > 1 && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Change (7 days)</p>
                {(() => {
                  const sevenDaysAgo = new Date();
                  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                  const weekAgoRate = rates.find(
                    (r) => new Date(r.rate_date) <= sevenDaysAgo
                  );
                  if (weekAgoRate) {
                    const change =
                      Number(latestRate.usd_uzs) - Number(weekAgoRate.usd_uzs);
                    const percentChange =
                      (change / Number(weekAgoRate.usd_uzs)) * 100;
                    const Icon =
                      change > 0
                        ? TrendingUp
                        : change < 0
                        ? TrendingDown
                        : Minus;
                    return (
                      <div
                        className={`text-lg font-medium flex items-center gap-1 justify-end ${
                          change > 0
                            ? "text-green-600"
                            : change < 0
                            ? "text-red-600"
                            : ""
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {change > 0 ? "+" : ""}
                        {change.toFixed(2)} ({percentChange > 0 ? "+" : ""}
                        {percentChange.toFixed(2)}%)
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rates Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Rate (USD/UZS)</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No exchange rates found. Click &quot;Update from CBU&quot; to fetch the latest rate.
                </TableCell>
              </TableRow>
            ) : (
              rates.map((rate) => (
                <TableRow key={rate.rate_date}>
                  <TableCell className="font-medium">
                    {format(new Date(rate.rate_date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    {Number(rate.usd_uzs).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>
                    {rate.source ? (
                      <Badge variant="outline">{rate.source}</Badge>
                    ) : (
                      <span className="text-muted-foreground">Manual</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {rate.created_at
                      ? format(new Date(rate.created_at), "MMM dd, yyyy HH:mm")
                      : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
