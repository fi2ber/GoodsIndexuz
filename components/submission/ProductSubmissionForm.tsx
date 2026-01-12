"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { FileUploader } from "./FileUploader";
import { CalibersInput } from "@/components/admin/CalibersInput";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { useTranslation } from "@/lib/i18n/hooks";
import type { Locale } from "@/lib/i18n/config";
import type { Database } from "@/types/database";
import { ChevronDown, ChevronUp } from "lucide-react";

type Category = Database["public"]["Tables"]["categories"]["Row"];

// Step 1: Product Information (required fields only)
const step1Schema = z.object({
  product_name_ru: z.string().min(1, "Product name (RU) is required"),
  product_name_en: z.string().min(1, "Product name (EN) is required"),
  category_id: z.string().min(1, "Category is required"),
  // Optional fields moved to expandable section
  description_ru: z.string().max(2000, "Description must not exceed 2000 characters").optional(),
  description_en: z.string().max(2000, "Description must not exceed 2000 characters").optional(),
});

// Optional Product Details (for expandable section)
const optionalProductDetailsSchema = z.object({
  hs_code: z.string().optional(),
  grade_ru: z.string().optional(),
  grade_en: z.string().optional(),
  origin_place_ru: z.string().optional(),
  origin_place_en: z.string().optional(),
  processing_method_ru: z.string().optional(),
  processing_method_en: z.string().optional(),
  moq: z.string().optional(),
  shelf_life: z.string().optional(),
  export_readiness: z.string().optional(),
  packaging_options: z.string().optional(),
});

// Step 2: Contact Information
const step2Schema = z.object({
  supplier_name: z.string().min(1, "Supplier name is required"),
  supplier_phone: z.string()
    .min(1, "Phone number is required")
    .regex(/^\+998[0-9]{9}$/, "Invalid phone format. Use: +998 XX XXX XX XX")
    .transform((val) => {
      // Нормализация: убираем пробелы, дефисы
      const cleaned = val.replace(/[\s-]/g, '');
      // Гарантируем формат +998XXXXXXXXX
      if (cleaned.startsWith('998')) return `+${cleaned}`;
      if (cleaned.startsWith('+998')) return cleaned;
      if (/^[0-9]{9}$/.test(cleaned)) return `+998${cleaned}`;
      return cleaned;
    }),
  // Email is now optional
  supplier_email: z.string().email("Invalid email address").optional().or(z.literal("")),
});

// Combined schema for final validation
const submissionSchema = step1Schema.merge(optionalProductDetailsSchema).merge(step2Schema);

type SubmissionFormData = z.infer<typeof submissionSchema>;

interface ProductSubmissionFormProps {
  categories: Category[];
  locale: Locale;
  onSubmit: (data: SubmissionFormData & { images: string[]; certificates: string[]; calibers: string[] }) => Promise<void>;
}

export function ProductSubmissionForm({ categories, locale, onSubmit }: ProductSubmissionFormProps) {
  const t = useTranslation(locale);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [certificates, setCertificates] = useState<string[]>([]);
  const [calibers, setCalibers] = useState<string[]>([]);
  const [showOptionalDetails, setShowOptionalDetails] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
    getValues,
    setValue,
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
    mode: "onChange",
  });

  // Auto-save to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("product_submission_draft");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        Object.keys(parsed).forEach((key) => {
          if (key !== "images" && key !== "certificates" && key !== "calibers") {
            setValue(key as keyof SubmissionFormData, parsed[key]);
          }
        });
        if (parsed.images) setImages(parsed.images);
        if (parsed.certificates) setCertificates(parsed.certificates);
        if (parsed.calibers) setCalibers(parsed.calibers);
      } catch (e) {
        console.error("Failed to restore draft:", e);
      }
    }
  }, [setValue]);

  // Save draft on change
  useEffect(() => {
    const formData = getValues();
    const draft = {
      ...formData,
      images,
      certificates,
      calibers,
    };
    localStorage.setItem("product_submission_draft", JSON.stringify(draft));
  }, [getValues, images, certificates, calibers]);

  const validateStep = async (step: number): Promise<boolean> => {
    let schema;
    switch (step) {
      case 1:
        schema = step1Schema;
        break;
      case 2:
        schema = step2Schema;
        break;
      default:
        return true;
    }

    const fields = Object.keys(schema.shape);
    const result = await trigger(fields as any);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 2));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onFormSubmit = async (data: SubmissionFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        ...data,
        images,
        certificates,
        calibers,
      });
      // Clear draft on success
      localStorage.removeItem("product_submission_draft");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (currentStep / 2) * 100;

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {currentStep} of 2</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step 1: Product Information */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Product Information</h3>
          
          {/* Required Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="product_name_ru">Product Name (Russian) *</Label>
              <Input
                id="product_name_ru"
                {...register("product_name_ru")}
                className="mt-1"
                disabled={isSubmitting}
              />
              {errors.product_name_ru && (
                <p className="text-sm text-destructive mt-1">{errors.product_name_ru.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="product_name_en">Product Name (English) *</Label>
              <Input
                id="product_name_en"
                {...register("product_name_en")}
                className="mt-1"
                disabled={isSubmitting}
              />
              {errors.product_name_en && (
                <p className="text-sm text-destructive mt-1">{errors.product_name_en.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="category_id">Category *</Label>
              <Select
                onValueChange={(value) => setValue("category_id", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {locale === "ru" ? category.name_ru : category.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category_id && (
                <p className="text-sm text-destructive mt-1">{errors.category_id.message}</p>
              )}
            </div>

            <div>
              <Label>Product Images (optional)</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Upload high-quality images of your product
              </p>
              <ImageUploader
                images={images}
                onChange={setImages}
                maxImages={5}
                uploadEndpoint="/api/product-submissions/upload"
              />
            </div>
          </div>

          {/* Optional Details - Expandable */}
          <div className="border-t pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowOptionalDetails(!showOptionalDetails)}
              className="w-full justify-between"
            >
              <span>Additional Product Details (Optional)</span>
              {showOptionalDetails ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            {showOptionalDetails && (
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="description_ru">Description (Russian)</Label>
                  <Textarea
                    id="description_ru"
                    {...register("description_ru")}
                    className="mt-1"
                    rows={4}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="description_en">Description (English)</Label>
                  <Textarea
                    id="description_en"
                    {...register("description_en")}
                    className="mt-1"
                    rows={4}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hs_code">HS Code</Label>
                    <Input
                      id="hs_code"
                      {...register("hs_code")}
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="moq">MOQ (Minimum Order Quantity)</Label>
                    <Input
                      id="moq"
                      {...register("moq")}
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="grade_ru">Grade (Russian)</Label>
                    <Input
                      id="grade_ru"
                      {...register("grade_ru")}
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="grade_en">Grade (English)</Label>
                    <Input
                      id="grade_en"
                      {...register("grade_en")}
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="origin_place_ru">Origin Place (Russian)</Label>
                    <Input
                      id="origin_place_ru"
                      {...register("origin_place_ru")}
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="origin_place_en">Origin Place (English)</Label>
                    <Input
                      id="origin_place_en"
                      {...register("origin_place_en")}
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="processing_method_ru">Processing Method (Russian)</Label>
                    <Input
                      id="processing_method_ru"
                      {...register("processing_method_ru")}
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="processing_method_en">Processing Method (English)</Label>
                    <Input
                      id="processing_method_en"
                      {...register("processing_method_en")}
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="shelf_life">Shelf Life</Label>
                    <Input
                      id="shelf_life"
                      {...register("shelf_life")}
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="export_readiness">Export Readiness</Label>
                    <Input
                      id="export_readiness"
                      {...register("export_readiness")}
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="packaging_options">Packaging Options (one per line)</Label>
                  <Textarea
                    id="packaging_options"
                    {...register("packaging_options")}
                    className="mt-1"
                    rows={3}
                    disabled={isSubmitting}
                    placeholder="e.g., 25kg bags&#10;50kg bags"
                  />
                </div>

                <div>
                  <Label>Calibers</Label>
                  <CalibersInput
                    calibers={calibers}
                    onChange={setCalibers}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label>Certificates and Documents (up to 3 PDF files)</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload quality certificates, export documents, etc.
                  </p>
                  <FileUploader
                    files={certificates}
                    onChange={setCertificates}
                    maxFiles={3}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Contact Information */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact Information</h3>
          <p className="text-sm text-muted-foreground">
            We&apos;ll contact you via WhatsApp/Telegram
          </p>

          <div>
            <Label htmlFor="supplier_name">Your Name *</Label>
            <Input
              id="supplier_name"
              {...register("supplier_name")}
              className="mt-1"
              disabled={isSubmitting}
            />
            {errors.supplier_name && (
              <p className="text-sm text-destructive mt-1">{errors.supplier_name.message}</p>
            )}
          </div>

          <div>
            <Controller
              name="supplier_phone"
              control={control}
              render={({ field, fieldState }) => (
                <PhoneInput
                  value={field.value || ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  disabled={isSubmitting}
                  label="Phone Number *"
                  placeholder="+998 XX XXX XX XX"
                />
              )}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1 || isSubmitting}
        >
          Back
        </Button>

        {currentStep < 2 ? (
          <Button 
            type="button" 
            onClick={handleNext} 
            disabled={isSubmitting}
          >
            Next
          </Button>
        ) : (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Product"}
          </Button>
        )}
      </div>
    </form>
  );
}

