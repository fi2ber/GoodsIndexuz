"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const months = [
  { num: 1, name: "Jan", fullName: "January" },
  { num: 2, name: "Feb", fullName: "February" },
  { num: 3, name: "Mar", fullName: "March" },
  { num: 4, name: "Apr", fullName: "April" },
  { num: 5, name: "May", fullName: "May" },
  { num: 6, name: "Jun", fullName: "June" },
  { num: 7, name: "Jul", fullName: "July" },
  { num: 8, name: "Aug", fullName: "August" },
  { num: 9, name: "Sep", fullName: "September" },
  { num: 10, name: "Oct", fullName: "October" },
  { num: 11, name: "Nov", fullName: "November" },
  { num: 12, name: "Dec", fullName: "December" },
];

interface SeasonalitySelectorProps {
  selectedMonths: number[];
  onChange: (months: number[]) => void;
}

export function SeasonalitySelector({
  selectedMonths,
  onChange,
}: SeasonalitySelectorProps) {
  const toggleMonth = (monthNum: number) => {
    if (selectedMonths.includes(monthNum)) {
      onChange(selectedMonths.filter((m) => m !== monthNum));
    } else {
      onChange([...selectedMonths, monthNum].sort((a, b) => a - b));
    }
  };

  const selectAll = () => {
    onChange(months.map((m) => m.num));
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Product Availability (Seasonality)</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={selectAll}
          >
            Select All
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearAll}
          >
            Clear
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2">
        {months.map((month) => {
          const isSelected = selectedMonths.includes(month.num);
          return (
            <Button
              key={month.num}
              type="button"
              variant={isSelected ? "default" : "outline"}
              onClick={() => toggleMonth(month.num)}
              className={cn(
                "h-12 flex flex-col items-center justify-center",
                isSelected && "bg-primary text-primary-foreground"
              )}
            >
              <span className="text-xs font-semibold">{month.name}</span>
            </Button>
          );
        })}
      </div>

      {selectedMonths.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Available in {selectedMonths.length} month{selectedMonths.length !== 1 ? "s" : ""}:{" "}
          {selectedMonths
            .map((m) => months.find((month) => month.num === m)?.name)
            .join(", ")}
        </p>
      )}
    </div>
  );
}

