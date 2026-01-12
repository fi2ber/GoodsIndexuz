"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  showValidationIcon?: boolean;
  className?: string;
}

// Узбекские операторы
const UZBEK_OPERATORS = ["90", "91", "93", "94", "95", "97", "98", "99"];

/**
 * Нормализует номер телефона в формат +998XXXXXXXXX
 */
function normalizePhone(phone: string): string {
  // Убираем все кроме цифр и +
  const cleaned = phone.replace(/[^\d+]/g, "");
  
  if (!cleaned) return "";
  
  // Если начинается с +998
  if (cleaned.startsWith("+998")) {
    const digits = cleaned.slice(4);
    if (digits.length <= 9) {
      return `+998${digits}`;
    }
    return `+998${digits.slice(0, 9)}`;
  }
  
  // Если начинается с 998
  if (cleaned.startsWith("998")) {
    const digits = cleaned.slice(3);
    if (digits.length <= 9) {
      return `+998${digits}`;
    }
    return `+998${digits.slice(0, 9)}`;
  }
  
  // Если только цифры (9 или меньше)
  if (/^\d+$/.test(cleaned) && cleaned.length <= 9) {
    return `+998${cleaned}`;
  }
  
  // Если начинается с +, но не +998
  if (cleaned.startsWith("+")) {
    return cleaned;
  }
  
  return `+998${cleaned.slice(0, 9)}`;
}

/**
 * Форматирует номер для отображения: +998 XX XXX XX XX
 */
function formatPhoneDisplay(phone: string): string {
  const normalized = normalizePhone(phone);
  
  if (!normalized || !normalized.startsWith("+998")) {
    return phone; // Возвращаем как есть, если не удалось нормализовать
  }
  
  const digits = normalized.slice(4); // Убираем +998
  
  if (digits.length === 0) {
    return "+998";
  }
  
  if (digits.length <= 2) {
    return `+998 ${digits}`;
  }
  
  if (digits.length <= 5) {
    return `+998 ${digits.slice(0, 2)} ${digits.slice(2)}`;
  }
  
  if (digits.length <= 7) {
    return `+998 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  }
  
  // Полный формат: +998 XX XXX XX XX
  return `+998 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`;
}

/**
 * Валидирует номер телефона
 */
function validatePhone(phone: string): { valid: boolean; error?: string } {
  const normalized = normalizePhone(phone);
  
  if (!normalized) {
    return { valid: false, error: "Phone number is required" };
  }
  
  // Проверяем формат +998XXXXXXXXX
  if (!/^\+998[0-9]{9}$/.test(normalized)) {
    return { valid: false, error: "Phone number must be 9 digits after +998" };
  }
  
  // Проверяем оператор
  const operator = normalized.slice(4, 6);
  if (!UZBEK_OPERATORS.includes(operator)) {
    return { valid: false, error: `Invalid operator code. Valid codes: ${UZBEK_OPERATORS.join(", ")}` };
  }
  
  return { valid: true };
}

export function PhoneInput({
  value,
  onChange,
  onBlur,
  error,
  disabled,
  label,
  placeholder = "+998 XX XXX XX XX",
  showValidationIcon = true,
  className,
}: PhoneInputProps) {
  const [displayValue, setDisplayValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Нормализуем и форматируем значение при изменении
  useEffect(() => {
    const formatted = formatPhoneDisplay(value || "");
    setDisplayValue(formatted);
  }, [value]);
  
  // Валидация
  const validation = value ? validatePhone(value) : { valid: false };
  const isValid = validation.valid && !error;
  const showError = error || (value && !validation.valid && !isFocused);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Разрешаем только цифры, +, пробелы и дефисы
    const cleaned = input.replace(/[^\d+\s-]/g, "");
    
    // Нормализуем
    const normalized = normalizePhone(cleaned);
    
    // Обновляем значение (передаем нормализованное)
    onChange(normalized);
  };
  
  const handleFocus = () => {
    setIsFocused(true);
    
    // Если поле пустое, добавляем +998
    if (!value) {
      onChange("+998");
    }
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    
    // Нормализуем при потере фокуса
    if (value) {
      const normalized = normalizePhone(value);
      if (normalized !== value) {
        onChange(normalized);
      }
    }
    
    if (onBlur) {
      onBlur();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Разрешаем: цифры, Backspace, Delete, Tab, Arrow keys, Home, End
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
    ];
    
    if (allowedKeys.includes(e.key)) {
      return;
    }
    
    // Разрешаем Ctrl/Cmd + A, C, V, X
    if ((e.ctrlKey || e.metaKey) && ["a", "c", "v", "x"].includes(e.key.toLowerCase())) {
      return;
    }
    
    // Разрешаем только цифры и +
    if (!/[\d+]/.test(e.key)) {
      e.preventDefault();
    }
  };
  
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    const normalized = normalizePhone(pasted);
    onChange(normalized);
  };
  
  return (
    <div className={className}>
      {label && (
        <Label htmlFor="phone-input" className="mb-2 block">
          {label}
        </Label>
      )}
      <div className="relative">
        <Input
          ref={inputRef}
          id="phone-input"
          type="tel"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "pr-10",
            showError && "border-destructive focus-visible:ring-destructive",
            isValid && !showError && "border-green-500 focus-visible:ring-green-500"
          )}
          autoComplete="tel"
        />
        {showValidationIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValid && !showError ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : showError ? (
              <XCircle className="h-4 w-4 text-destructive" />
            ) : null}
          </div>
        )}
      </div>
      {showError && (
        <p className="text-sm text-destructive mt-1">
          {error || validation.error}
        </p>
      )}
      {!showError && value && (
        <p className="text-xs text-muted-foreground mt-1">
          Example: +998 90 123 45 67
        </p>
      )}
    </div>
  );
}

