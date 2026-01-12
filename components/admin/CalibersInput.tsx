"use client";

import { useState, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CalibersInputProps {
  calibers: string[];
  onChange: (calibers: string[]) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function CalibersInput({
  calibers,
  onChange,
  label = "Calibers",
  placeholder = "Enter caliber and press Enter",
  className,
}: CalibersInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !calibers.includes(trimmed)) {
      onChange([...calibers, trimmed]);
      setInputValue("");
    }
  };

  const handleRemove = (index: number) => {
    onChange(calibers.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleAdd}
          disabled={!inputValue.trim() || calibers.includes(inputValue.trim())}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {calibers.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {calibers.map((caliber, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="gap-1.5 py-1.5 px-3"
            >
              <span>{caliber}</span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="ml-1 rounded-full hover:bg-destructive/20 p-0.5 transition-colors"
                aria-label={`Remove ${caliber}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Press Enter or click the + button to add a caliber
      </p>
    </div>
  );
}

