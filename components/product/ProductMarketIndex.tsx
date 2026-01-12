"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";
import { TrendingUp, TrendingDown, Minus, AlertCircle, Info } from "lucide-react";
import { format, subDays, parseISO, differenceInDays } from "date-fns";
import type { Locale } from "@/lib/i18n/config";

export interface MarketQuotePoint {
  date: string;
  priceMidUsd: number;
  toleranceUsd: number;
  usdUzs: number | null;
}

export interface LatestQuote {
  date: string;
  priceMidUsd: number;
  toleranceUsd: number;
}

interface ProductMarketIndexProps {
  series: MarketQuotePoint[];
  latestQuote: LatestQuote | null;
  locale: Locale;
}

type DisplayMode = "usd" | "uzs" | "index";
type TimeRange = "1m" | "3m" | "6m" | "1y" | "all";

const TIME_RANGE_DAYS: Record<TimeRange, number | null> = {
  "1m": 30,
  "3m": 90,
  "6m": 180,
  "1y": 365,
  "all": null,
};

export function ProductMarketIndex({
  series,
  latestQuote,
  locale,
}: ProductMarketIndexProps) {
  const [displayMode, setDisplayMode] = useState<DisplayMode>("usd");
  const [timeRange, setTimeRange] = useState<TimeRange>("3m");
  const [baseDate, setBaseDate] = useState<string | null>(null);

  // Filter series by time range
  const filteredSeries = useMemo(() => {
    if (!series || !Array.isArray(series) || !series.length) return [];
    
    // Filter out invalid dates and sort by date
    const validSeries = series
      .filter((point) => {
        if (!point || !point.date) return false;
        try {
          const date = parseISO(point.date);
          return !isNaN(date.getTime());
        } catch {
          return false;
        }
      })
      .sort((a, b) => {
        try {
          const dateA = parseISO(a.date);
          const dateB = parseISO(b.date);
          return dateA.getTime() - dateB.getTime();
        } catch {
          return 0;
        }
      });
    
    const days = TIME_RANGE_DAYS[timeRange];
    if (days === null) return validSeries;
    
    const cutoffDate = subDays(new Date(), days);
    return validSeries.filter((point) => {
      try {
        const pointDate = parseISO(point.date);
        return pointDate >= cutoffDate;
      } catch {
        return false;
      }
    });
  }, [series, timeRange]);

  // Available dates for base selection (for index mode) - only valid dates
  const availableDates = useMemo(() => {
    return filteredSeries
      .map((p) => p.date)
      .filter((date) => {
        if (!date) return false;
        try {
          const parsed = parseISO(date);
          return !isNaN(parsed.getTime());
        } catch {
          return false;
        }
      });
  }, [filteredSeries]);

  // Effective base date (first date if not selected) - validated
  const effectiveBaseDate = useMemo(() => {
    const validBaseDate = baseDate && availableDates.includes(baseDate) ? baseDate : null;
    const fallbackDate = availableDates[0] || null;
    
    // Validate the date before returning
    if (fallbackDate) {
      try {
        const parsed = parseISO(fallbackDate);
        if (isNaN(parsed.getTime())) {
          return null;
        }
      } catch {
        return null;
      }
    }
    
    return validBaseDate || fallbackDate;
  }, [baseDate, availableDates]);

  // Base price for index calculation
  const basePrice = useMemo(() => {
    if (!effectiveBaseDate) return null;
    const basePoint = filteredSeries.find((p) => p.date === effectiveBaseDate);
    return basePoint?.priceMidUsd || null;
  }, [filteredSeries, effectiveBaseDate]);

  // Transform data for chart based on display mode
  const chartData = useMemo(() => {
    return filteredSeries
      .map((point) => {
        if (!point || !point.date || typeof point.priceMidUsd !== 'number' || typeof point.toleranceUsd !== 'number') {
          return null;
        }

        let value: number;
        let minValue: number | undefined;
        let maxValue: number | undefined;

        try {
          switch (displayMode) {
            case "uzs":
              if (point.usdUzs && typeof point.usdUzs === 'number') {
                value = point.priceMidUsd * point.usdUzs;
                minValue = (point.priceMidUsd - point.toleranceUsd) * point.usdUzs;
                maxValue = (point.priceMidUsd + point.toleranceUsd) * point.usdUzs;
              } else {
                value = 0;
              }
              break;
            case "index":
              if (basePrice && basePrice > 0) {
                value = (point.priceMidUsd / basePrice) * 100;
                minValue = ((point.priceMidUsd - point.toleranceUsd) / basePrice) * 100;
                maxValue = ((point.priceMidUsd + point.toleranceUsd) / basePrice) * 100;
              } else {
                value = 100;
              }
              break;
            default: // usd
              value = point.priceMidUsd;
              minValue = point.priceMidUsd - point.toleranceUsd;
              maxValue = point.priceMidUsd + point.toleranceUsd;
          }

          // Validate and parse date
          if (!point.date || typeof point.date !== 'string') {
            return null;
          }
          
          let date: Date;
          try {
            date = parseISO(point.date);
            if (!date || isNaN(date.getTime())) {
              return null;
            }
          } catch (error) {
            console.warn('Error parsing date:', point.date, error);
            return null;
          }

          // Format date safely
          let formattedDate: string;
          try {
            formattedDate = format(date, "MMM dd");
          } catch (error) {
            console.warn('Error formatting date:', date, error);
            formattedDate = point.date; // Fallback to raw date string
          }

          // Validate numeric values
          if (!isFinite(value) || isNaN(value)) {
            console.warn('Invalid value for point:', point, 'value:', value);
            return null;
          }

          // Validate min/max values if they exist
          if (minValue !== undefined && (!isFinite(minValue) || isNaN(minValue))) {
            minValue = undefined;
          }
          if (maxValue !== undefined && (!isFinite(maxValue) || isNaN(maxValue))) {
            maxValue = undefined;
          }

          return {
            date: point.date,
            formattedDate,
            value,
            minValue,
            maxValue,
            raw: point,
          };
        } catch (error) {
          console.warn('Error processing point:', point, error);
          return null;
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [filteredSeries, displayMode, basePrice]);

  // Calculate change metrics
  const changeMetrics = useMemo(() => {
    if (chartData.length < 2) return null;

    try {
      const latest = chartData[chartData.length - 1].value;
      const oldest = chartData[0].value;
      
      if (oldest === 0 || !isFinite(oldest) || !isFinite(latest)) {
        return null;
      }

      const change = latest - oldest;
      const percentChange = (change / oldest) * 100;

      // Calculate 7-day change if enough data
      let change7d = null;
      if (chartData.length > 7) {
        const weekAgoIdx = Math.max(0, chartData.length - 8);
        const weekAgo = chartData[weekAgoIdx].value;
        if (weekAgo !== 0 && isFinite(weekAgo)) {
          change7d = ((latest - weekAgo) / weekAgo) * 100;
        }
      }

      let daysSpan = 0;
      try {
        const latestDate = parseISO(chartData[chartData.length - 1].date);
        const oldestDate = parseISO(chartData[0].date);
        if (!isNaN(latestDate.getTime()) && !isNaN(oldestDate.getTime())) {
          daysSpan = differenceInDays(latestDate, oldestDate);
        }
      } catch (error) {
        console.warn('Error calculating days span:', error);
      }

      return {
        change,
        percentChange,
        change7d,
        daysSpan,
      };
    } catch (error) {
      console.warn('Error calculating change metrics:', error);
      return null;
    }
  }, [chartData]);

  // Format value based on mode
  const formatValue = (value: number): string => {
    switch (displayMode) {
      case "uzs":
        return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
          style: "currency",
          currency: "UZS",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case "index":
        return value.toFixed(2);
      default:
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 3,
          maximumFractionDigits: 5,
        }).format(value);
    }
  };

  // Get unit label
  const getUnitLabel = (): string => {
    switch (displayMode) {
      case "uzs":
        return "UZS/kg";
      case "index":
        return locale === "ru" ? "индекс" : "index";
      default:
        return "USD/kg";
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    if (!data || !data.date) return null;

    try {
      // Parse and validate date
      let date: Date;
      try {
        date = parseISO(data.date);
        if (!date || isNaN(date.getTime())) return null;
      } catch (error) {
        console.warn('Error parsing tooltip date:', data.date, error);
        return null;
      }

      // Format date safely
      let formattedDate: string;
      try {
        formattedDate = format(date, "MMMM dd, yyyy");
      } catch (error) {
        console.warn('Error formatting tooltip date:', date, error);
        formattedDate = data.date; // Fallback
      }

      // Validate numeric values
      if (data.value === undefined || data.value === null || !isFinite(data.value) || isNaN(data.value)) {
        return null;
      }

      return (
        <div className="bg-background border rounded-lg shadow-lg p-3 text-sm">
          <p className="font-medium">{formattedDate}</p>
          <p className="text-primary">
            {formatValue(data.value)} <span className="text-muted-foreground">{getUnitLabel()}</span>
          </p>
          {data.minValue !== undefined && 
           data.maxValue !== undefined &&
           isFinite(data.minValue) && 
           isFinite(data.maxValue) &&
           displayMode !== "index" && (
            <p className="text-xs text-muted-foreground">
              {locale === "ru" ? "Диапазон:" : "Range:"} {formatValue(data.minValue)} — {formatValue(data.maxValue)}
            </p>
          )}
        </div>
      );
    } catch (error) {
      console.warn('Error in CustomTooltip:', error);
      return null;
    }
  };

  if (!latestQuote || !series || !Array.isArray(series) || series.length === 0) {
    return null; // Don't render if no data
  }

  const latestValue = chartData.length > 0 ? chartData[chartData.length - 1].value : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {locale === "ru" ? "Рыночный индекс" : "Market Index"}
            </CardTitle>
            <CardDescription>
              {locale === "ru" 
                ? "Индикативная стоимость FOB (не является офертой)"
                : "Indicative FOB price (not an offer)"}
            </CardDescription>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Display mode selector */}
            <div className="flex rounded-lg border overflow-hidden">
              <Button
                variant={displayMode === "usd" ? "default" : "ghost"}
                size="sm"
                className="rounded-none px-3"
                onClick={() => setDisplayMode("usd")}
              >
                USD
              </Button>
              <Button
                variant={displayMode === "uzs" ? "default" : "ghost"}
                size="sm"
                className="rounded-none px-3 border-l"
                onClick={() => setDisplayMode("uzs")}
              >
                UZS
              </Button>
              <Button
                variant={displayMode === "index" ? "default" : "ghost"}
                size="sm"
                className="rounded-none px-3 border-l"
                onClick={() => setDisplayMode("index")}
              >
                {locale === "ru" ? "Индекс" : "Index"}
              </Button>
            </div>

            {/* Time range selector */}
            <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1M</SelectItem>
                <SelectItem value="3m">3M</SelectItem>
                <SelectItem value="6m">6M</SelectItem>
                <SelectItem value="1y">1Y</SelectItem>
                <SelectItem value="all">{locale === "ru" ? "Всё" : "All"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current value and change */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              {locale === "ru" ? "Текущая цена" : "Current Price"}
            </p>
            <p className="text-2xl font-bold">
              {formatValue(latestValue)}
            </p>
            <p className="text-xs text-muted-foreground">{getUnitLabel()}</p>
          </div>

          {displayMode === "usd" && latestQuote && (
            <div>
              <p className="text-sm text-muted-foreground">
                {locale === "ru" ? "Допуск" : "Tolerance"}
              </p>
              <p className="text-lg font-medium">
                ±${latestQuote.toleranceUsd.toFixed(3)}
              </p>
            </div>
          )}

          {changeMetrics && (
            <>
              <div>
                <p className="text-sm text-muted-foreground">
                  {locale === "ru" ? `Изменение (${changeMetrics.daysSpan}д)` : `Change (${changeMetrics.daysSpan}d)`}
                </p>
                <p className={`text-lg font-medium flex items-center gap-1 ${
                  changeMetrics.percentChange > 0 
                    ? "text-green-600" 
                    : changeMetrics.percentChange < 0 
                      ? "text-red-600" 
                      : ""
                }`}>
                  {changeMetrics.percentChange > 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : changeMetrics.percentChange < 0 ? (
                    <TrendingDown className="h-4 w-4" />
                  ) : (
                    <Minus className="h-4 w-4" />
                  )}
                  {changeMetrics.percentChange > 0 ? "+" : ""}
                  {changeMetrics.percentChange.toFixed(2)}%
                </p>
              </div>

              {changeMetrics.change7d !== null && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {locale === "ru" ? "7 дней" : "7 days"}
                  </p>
                  <p className={`text-lg font-medium ${
                    changeMetrics.change7d > 0 
                      ? "text-green-600" 
                      : changeMetrics.change7d < 0 
                        ? "text-red-600" 
                        : ""
                  }`}>
                    {changeMetrics.change7d > 0 ? "+" : ""}
                    {changeMetrics.change7d.toFixed(2)}%
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Base date selector for index mode */}
        {displayMode === "index" && availableDates.length > 1 && (
          <div className="flex items-center gap-2 text-sm">
            <Info className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {locale === "ru" ? "База (100):" : "Base (100):"}
            </span>
            <Select
              value={effectiveBaseDate || ""}
              onValueChange={setBaseDate}
            >
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue>
                  {effectiveBaseDate ? (() => {
                    try {
                      const parsed = parseISO(effectiveBaseDate);
                      if (!isNaN(parsed.getTime())) {
                        return format(parsed, "MMM dd, yyyy");
                      }
                    } catch (error) {
                      console.warn('Error formatting base date:', error);
                    }
                    return effectiveBaseDate;
                  })() : ""}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {availableDates.map((date) => {
                  try {
                    const parsedDate = parseISO(date);
                    if (isNaN(parsedDate.getTime())) return null;
                    return (
                      <SelectItem key={date} value={date}>
                        {format(parsedDate, "MMM dd, yyyy")}
                      </SelectItem>
                    );
                  } catch (error) {
                    console.warn('Error formatting date in selector:', date, error);
                    return null;
                  }
                }).filter(Boolean)}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Chart */}
        <div className="h-[300px] w-full">
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="formattedDate" 
                  className="text-xs"
                  tick={{ fontSize: 11 }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) => 
                    displayMode === "uzs" 
                      ? `${(value / 1000).toFixed(0)}k`
                      : displayMode === "index"
                        ? value.toFixed(0)
                        : value.toFixed(2)
                  }
                  domain={displayMode === "index" ? ["auto", "auto"] : ["dataMin - 0.01", "dataMax + 0.01"]}
                />
                <Tooltip content={<CustomTooltip />} />
                
                {/* Tolerance area (only for USD mode) */}
                {displayMode === "usd" && (
                  <Area
                    type="monotone"
                    dataKey="maxValue"
                    stroke="none"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.1}
                  />
                )}
                
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={chartData.length < 30}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <p>{locale === "ru" ? "Недостаточно данных для графика" : "Not enough data for chart"}</p>
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p>
            {locale === "ru" 
              ? "Данные являются индикативной оценкой рыночной стоимости и не являются публичной офертой. Финальная цена определяется по запросу."
              : "This data is an indicative market estimate and does not constitute a public offer. Final price is determined upon request."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
