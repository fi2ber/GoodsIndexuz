"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { CalibersInput } from "@/components/admin/CalibersInput";
import { CertificatesManager } from "@/components/admin/CertificatesManager";
import { SeasonalitySelector } from "@/components/admin/SeasonalitySelector";
import { FAQEditor } from "@/components/admin/FAQEditor";
import { MarketQuotesManager } from "@/components/admin/MarketQuotesManager";
import { generateSlug } from "@/lib/utils/slug";
import { RotateCcw } from "lucide-react";
import type { Database } from "@/types/database";

type Category = Database["public"]["Tables"]["categories"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];

const productSchema = z.object({
  category_id: z.string().min(1, "Category is required"),
  name_ru: z.string().min(1, "Russian name is required"),
  name_en: z.string().min(1, "English name is required"),
  variety_ru: z.string().optional(),
  variety_en: z.string().optional(),
  origin_ru: z.string().optional(),
  origin_en: z.string().optional(),
  packaging_options: z.string().optional(),
  moq: z.string().optional(),
  shelf_life: z.string().optional(),
  export_readiness: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  hs_code: z.string().optional(),
  grade_ru: z.string().optional(),
  grade_en: z.string().optional(),
  origin_place_ru: z.string().optional(),
  origin_place_en: z.string().optional(),
  calibers: z.array(z.string()).optional(),
  processing_method_ru: z.string().optional(),
  processing_method_en: z.string().optional(),
  description_ru: z.string().max(2000, "Description must not exceed 2000 characters").optional(),
  description_en: z.string().max(2000, "Description must not exceed 2000 characters").optional(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  certificates_ru: z.array(z.object({
    name: z.string(),
    image_url: z.string(),
    id: z.string().optional(),
  })).optional(),
  certificates_en: z.array(z.object({
    name: z.string(),
    image_url: z.string(),
    id: z.string().optional(),
  })).optional(),
  seasonality: z.array(z.number().min(1).max(12)).optional(),
  logistics_info_ru: z.union([z.string(), z.record(z.any())]).optional().nullable(),
  logistics_info_en: z.union([z.string(), z.record(z.any())]).optional().nullable(),
  video_url: z.string().url().optional().nullable().or(z.literal("")),
  faqs_ru: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).optional(),
  faqs_en: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  categories: Category[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>(() => {
    if (!product) return [];
    // Убеждаемся, что image_urls правильно парсится
    if (Array.isArray(product.image_urls)) {
      return product.image_urls.filter((url): url is string => typeof url === 'string');
    }
    return [];
  });
  const [calibers, setCalibers] = useState<string[]>(() => {
    if (!product) return [];
    if (Array.isArray(product.calibers)) {
      return product.calibers.filter((caliber): caliber is string => typeof caliber === 'string');
    }
    return [];
  });
  const [certificatesRu, setCertificatesRu] = useState<Array<{name: string; image_url: string; id?: string}>>(() => {
    if (!product) return [];
    if (Array.isArray(product.certificates_ru)) {
      return product.certificates_ru as Array<{name: string; image_url: string; id?: string}>;
    }
    return [];
  });
  const [certificatesEn, setCertificatesEn] = useState<Array<{name: string; image_url: string; id?: string}>>(() => {
    if (!product) return [];
    if (Array.isArray(product.certificates_en)) {
      return product.certificates_en as Array<{name: string; image_url: string; id?: string}>;
    }
    return [];
  });
  const [seasonality, setSeasonality] = useState<number[]>(() => {
    if (!product) return [];
    if (Array.isArray(product.seasonality)) {
      return product.seasonality.filter((m): m is number => typeof m === 'number' && m >= 1 && m <= 12);
    }
    return [];
  });
  const [faqsRu, setFaqsRu] = useState<Array<{question: string; answer: string}>>(() => {
    if (!product) return [];
    if (Array.isArray(product.faqs_ru)) {
      return product.faqs_ru as Array<{question: string; answer: string}>;
    }
    return [];
  });
  const [faqsEn, setFaqsEn] = useState<Array<{question: string; answer: string}>>(() => {
    if (!product) return [];
    if (Array.isArray(product.faqs_en)) {
      return product.faqs_en as Array<{question: string; answer: string}>;
    }
    return [];
  });
  const [slugWarning, setSlugWarning] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          category_id: product.category_id,
          name_ru: product.name_ru,
          name_en: product.name_en,
          variety_ru: product.variety_ru || "",
          variety_en: product.variety_en || "",
          origin_ru: product.origin_ru || "",
          origin_en: product.origin_en || "",
          packaging_options: Array.isArray(product.packaging_options)
            ? product.packaging_options.join("\n")
            : "",
          moq: product.moq || "",
          shelf_life: product.shelf_life || "",
          export_readiness: product.export_readiness || "",
          slug: product.slug,
          is_active: product.is_active,
          hs_code: product.hs_code || "",
          grade_ru: product.grade_ru || "",
          grade_en: product.grade_en || "",
          origin_place_ru: product.origin_place_ru || "",
          origin_place_en: product.origin_place_en || "",
          processing_method_ru: product.processing_method_ru || "",
          processing_method_en: product.processing_method_en || "",
          description_ru: product.description_ru || "",
          description_en: product.description_en || "",
          is_featured: product.is_featured || false,
          certificates_ru: Array.isArray(product.certificates_ru) ? product.certificates_ru : [],
          certificates_en: Array.isArray(product.certificates_en) ? product.certificates_en : [],
          seasonality: Array.isArray(product.seasonality) ? product.seasonality : [],
          logistics_info_ru: product.logistics_info_ru ? JSON.stringify(product.logistics_info_ru, null, 2) : "",
          logistics_info_en: product.logistics_info_en ? JSON.stringify(product.logistics_info_en, null, 2) : "",
          video_url: product.video_url || "",
          faqs_ru: Array.isArray(product.faqs_ru) ? product.faqs_ru : [],
          faqs_en: Array.isArray(product.faqs_en) ? product.faqs_en : [],
        }
      : {
          is_active: true,
          is_featured: false,
          certificates_ru: [],
          certificates_en: [],
          seasonality: [],
          logistics_info_ru: "",
          logistics_info_en: "",
          video_url: "",
          faqs_ru: [],
          faqs_en: [],
        },
  });

  const isActive = watch("is_active");
  const isFeatured = watch("is_featured");
  const nameEn = watch("name_en");
  const slug = watch("slug");
  const formValues = watch();

  // Auto-save функциональность
  const { clearDraft, restoreDraft } = useAutoSave({
    data: { ...formValues, images },
    productId: product?.id,
    enabled: true,
  });

  // Восстановление черновика при загрузке
  useEffect(() => {
    if (!product) {
      const draft = restoreDraft();
      if (draft) {
        Object.keys(draft).forEach((key) => {
          if (key !== "images" && draft[key] !== undefined) {
            setValue(key as keyof ProductFormData, draft[key]);
          }
        });
        if (draft.images && Array.isArray(draft.images)) {
          setImages(draft.images);
        }
      }
    }
  }, [product, restoreDraft, setValue]);

  // Автогенерация slug при создании нового товара
  useEffect(() => {
    if (!product && nameEn) {
      const generatedSlug = generateSlug(nameEn);
      setValue("slug", generatedSlug);
    }
  }, [nameEn, product, setValue]);

  // Проверка уникальности slug
  useEffect(() => {
    if (slug && slug.length > 0) {
      const checkSlug = async () => {
        try {
          const response = await fetch(
            `/api/admin/products/check-slug?slug=${encodeURIComponent(slug)}${product?.id ? `&excludeId=${product.id}` : ""}`
          );
          const data = await response.json();
          if (!data.unique) {
            setSlugWarning("This slug is already in use");
          } else {
            setSlugWarning(null);
          }
        } catch {
          // Игнорируем ошибки проверки
        }
      };

      const timeoutId = setTimeout(checkSlug, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [slug, product?.id]);

  const handleRegenerateSlug = () => {
    if (nameEn) {
      const generatedSlug = generateSlug(nameEn);
      setValue("slug", generatedSlug);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const packagingArray = data.packaging_options
        ? data.packaging_options.split("\n").filter((line) => line.trim())
        : [];

      // Parse logistics_info from JSON strings
      let logisticsInfoRu = null;
      let logisticsInfoEn = null;
      try {
        if (data.logistics_info_ru && typeof data.logistics_info_ru === 'string' && data.logistics_info_ru.trim()) {
          logisticsInfoRu = JSON.parse(data.logistics_info_ru);
        } else if (data.logistics_info_ru && typeof data.logistics_info_ru === 'object') {
          logisticsInfoRu = data.logistics_info_ru;
        }
      } catch (e) {
        console.error("Error parsing logistics_info_ru:", e);
      }
      try {
        if (data.logistics_info_en && typeof data.logistics_info_en === 'string' && data.logistics_info_en.trim()) {
          logisticsInfoEn = JSON.parse(data.logistics_info_en);
        } else if (data.logistics_info_en && typeof data.logistics_info_en === 'object') {
          logisticsInfoEn = data.logistics_info_en;
        }
      } catch (e) {
        console.error("Error parsing logistics_info_en:", e);
      }

      const payload = {
        ...data,
        packaging_options: packagingArray,
        image_urls: images,
        calibers: calibers,
        certificates_ru: certificatesRu,
        certificates_en: certificatesEn,
        seasonality: seasonality,
        logistics_info_ru: logisticsInfoRu,
        logistics_info_en: logisticsInfoEn,
        faqs_ru: faqsRu,
        faqs_en: faqsEn,
      };

      console.log("Saving product with images:", images);
      console.log("Payload:", payload);

      const url = product
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products";
      const method = product ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save product");
      }

      const result = await response.json();
      console.log("Save product response:", result);
      console.log("Response product image_urls:", result.product?.image_urls);
      console.log("Response product image_urls type:", typeof result.product?.image_urls);
      console.log("Response product image_urls isArray:", Array.isArray(result.product?.image_urls));
      
      // Обновляем images если API вернул обновленные URL (для новых товаров с временными путями)
      if (result.product?.image_urls !== undefined) {
        let savedImages: string[] = [];
        const imageUrls = result.product.image_urls;
        
        console.log("Raw image_urls:", imageUrls);
        console.log("image_urls type:", typeof imageUrls);
        console.log("image_urls isArray:", Array.isArray(imageUrls));
        
        if (Array.isArray(imageUrls)) {
          // Если это массив, преобразуем все элементы в строки
          savedImages = imageUrls.map((url: any) => {
            if (typeof url === 'string') {
              return url;
            }
            // Если это не строка, пытаемся преобразовать
            return String(url);
          }).filter((url: string) => url && url.length > 0);
        } else if (imageUrls && typeof imageUrls === 'object') {
          // Если это объект (JSONB может быть объектом), пытаемся преобразовать
          try {
            const parsed = JSON.parse(JSON.stringify(imageUrls));
            if (Array.isArray(parsed)) {
              savedImages = parsed.map((url: any) => String(url)).filter((url: string) => url && url.length > 0);
            }
          } catch (e) {
            console.error("Error parsing image_urls:", e);
          }
        }
        
        console.log("Setting images from response:", savedImages);
        setImages(savedImages);
      }
      
      // Очищаем черновик после успешного сохранения
      clearDraft();

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Keyboard shortcuts - вызываем после определения onSubmit
  useKeyboardShortcuts({
    onSave: () => handleSubmit(onSubmit)(),
    onCancel: () => router.back(),
    enabled: true,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="details">Product Details</TabsTrigger>
          <TabsTrigger value="technical">Technical Information</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="enhancements">Enhancements</TabsTrigger>
          <TabsTrigger value="market-index" disabled={!product}>Market Index</TabsTrigger>
        </TabsList>

        {/* Tab 1: Basic Information */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category_id">Category *</Label>
                <Select
                  value={watch("category_id")}
                  onValueChange={(value) => setValue("category_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name_en} / {category.name_ru}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category_id && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.category_id.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name_en">Name (English) *</Label>
                  <Input id="name_en" {...register("name_en")} />
                  {errors.name_en && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.name_en.message}
                    </p>
                  )}
                  {!product && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Slug will be auto-generated from this field
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="name_ru">Name (Russian) *</Label>
                  <Input id="name_ru" {...register("name_ru")} />
                  {errors.name_ru && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.name_ru.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="slug">Slug *</Label>
                  {!product && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRegenerateSlug}
                      className="h-7 text-xs"
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Regenerate
                    </Button>
                  )}
                </div>
                <Input id="slug" {...register("slug")} />
                {errors.slug && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.slug.message}
                  </p>
                )}
                {slugWarning && (
                  <p className="text-sm text-yellow-600 mt-1">{slugWarning}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  URL-friendly identifier for the product
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={isActive}
                  onChange={(e) => setValue("is_active", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="is_active">Active (visible on public site)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={isFeatured}
                  onChange={(e) => setValue("is_featured", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="is_featured">Featured Product (priority in homepage recommendations)</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Product Details */}
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="variety_en">Variety (English)</Label>
                  <Input id="variety_en" {...register("variety_en")} />
                </div>
                <div>
                  <Label htmlFor="variety_ru">Variety (Russian)</Label>
                  <Input id="variety_ru" {...register("variety_ru")} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="origin_en">Origin (English)</Label>
                  <Input id="origin_en" {...register("origin_en")} />
                </div>
                <div>
                  <Label htmlFor="origin_ru">Origin (Russian)</Label>
                  <Input id="origin_ru" {...register("origin_ru")} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="origin_place_en">Origin Place (English)</Label>
                  <Input id="origin_place_en" {...register("origin_place_en")} placeholder="e.g., Fergana Valley" />
                </div>
                <div>
                  <Label htmlFor="origin_place_ru">Origin Place (Russian)</Label>
                  <Input id="origin_place_ru" {...register("origin_place_ru")} placeholder="e.g., Ферганская долина" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="grade_en">Grade (English)</Label>
                  <Input id="grade_en" {...register("grade_en")} placeholder="e.g., Premium" />
                </div>
                <div>
                  <Label htmlFor="grade_ru">Grade (Russian)</Label>
                  <Input id="grade_ru" {...register("grade_ru")} placeholder="e.g., Премиум" />
                </div>
              </div>

              <div>
                <Label htmlFor="hs_code">HS Code (ТНВЭД код)</Label>
                <Input 
                  id="hs_code" 
                  {...register("hs_code")} 
                  placeholder="e.g., 08.02.11.0000"
                  pattern="[0-9]{2}\\.[0-9]{4}\\.[0-9]{6}"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Format: XX.XXXX.XXXXXX (10-digit HS code)
                </p>
              </div>

              <CalibersInput
                calibers={calibers}
                onChange={setCalibers}
                label="Calibers"
                placeholder="Enter caliber (e.g., 20-22mm)"
              />

              <div>
                <Label htmlFor="packaging_options">
                  Packaging Options (one per line)
                </Label>
                <Textarea
                  id="packaging_options"
                  {...register("packaging_options")}
                  rows={4}
                  placeholder="10kg bags&#10;25kg boxes&#10;50kg sacks"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter each packaging option on a new line
                </p>
              </div>

              <div>
                <Label htmlFor="moq">Minimum Order Quantity (MOQ)</Label>
                <Input id="moq" {...register("moq")} placeholder="e.g., 1 container (20 MT)" />
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum quantity required for order
                </p>
              </div>

              <div>
                <Label htmlFor="shelf_life">Shelf Life</Label>
                <Input id="shelf_life" {...register("shelf_life")} placeholder="e.g., 24 months" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Technical Information */}
        <TabsContent value="technical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Technical Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="description_en">Description (English)</Label>
                <Textarea
                  id="description_en"
                  {...register("description_en")}
                  rows={6}
                  placeholder="Enter product description (max 2000 characters)"
                  maxLength={2000}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {watch("description_en")?.length || 0} / 2000 characters
                </p>
                {errors.description_en && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.description_en.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description_ru">Description (Russian)</Label>
                <Textarea
                  id="description_ru"
                  {...register("description_ru")}
                  rows={6}
                  placeholder="Введите описание товара (макс. 2000 символов)"
                  maxLength={2000}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {watch("description_ru")?.length || 0} / 2000 символов
                </p>
                {errors.description_ru && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.description_ru.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="processing_method_en">Processing Method (English)</Label>
                <Textarea
                  id="processing_method_en"
                  {...register("processing_method_en")}
                  rows={4}
                  placeholder="Describe the processing method and technology..."
                />
              </div>

              <div>
                <Label htmlFor="processing_method_ru">Processing Method (Russian)</Label>
                <Textarea
                  id="processing_method_ru"
                  {...register("processing_method_ru")}
                  rows={4}
                  placeholder="Опишите технологический процесс..."
                />
              </div>

              <div>
                <Label htmlFor="export_readiness">Export Readiness</Label>
                <Textarea
                  id="export_readiness"
                  {...register("export_readiness")}
                  rows={3}
                  placeholder="Describe export readiness, certifications, compliance..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Images */}
        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader
                images={images}
                onChange={setImages}
                productId={product?.id}
                maxImages={10}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Enhancements */}
        <TabsContent value="enhancements" className="space-y-6">
          {/* Video URL */}
          <Card>
            <CardHeader>
              <CardTitle>Video Presentation</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="video_url">Video URL</Label>
                <Input
                  id="video_url"
                  {...register("video_url")}
                  placeholder="https://youtube.com/watch?v=..."
                  type="url"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Link to product presentation video (YouTube, Vimeo, etc.)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Seasonality */}
          <Card>
            <CardHeader>
              <CardTitle>Seasonality</CardTitle>
            </CardHeader>
            <CardContent>
              <SeasonalitySelector
                selectedMonths={seasonality}
                onChange={setSeasonality}
              />
            </CardContent>
          </Card>

          {/* Certificates */}
          <Card>
            <CardHeader>
              <CardTitle>Certificates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <CertificatesManager
                  certificates={certificatesRu}
                  onChange={setCertificatesRu}
                  locale="ru"
                />
              </div>
              <div>
                <CertificatesManager
                  certificates={certificatesEn}
                  onChange={setCertificatesEn}
                  locale="en"
                />
              </div>
            </CardContent>
          </Card>

          {/* FAQs */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <FAQEditor
                  faqs={faqsRu}
                  onChange={setFaqsRu}
                  locale="ru"
                />
              </div>
              <div>
                <FAQEditor
                  faqs={faqsEn}
                  onChange={setFaqsEn}
                  locale="en"
                />
              </div>
            </CardContent>
          </Card>

          {/* Logistics Info - Simple JSON editor for now */}
          <Card>
            <CardHeader>
              <CardTitle>Logistics Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="logistics_info_ru">Logistics Info (Russian)</Label>
                <Textarea
                  id="logistics_info_ru"
                  {...register("logistics_info_ru")}
                  rows={4}
                  placeholder='{"ports": ["Tashkent"], "shipping_methods": ["Sea", "Rail"]}'
                />
                <p className="text-xs text-muted-foreground mt-1">
                  JSON format: ports, shipping methods, delivery time, etc.
                </p>
              </div>
              <div>
                <Label htmlFor="logistics_info_en">Logistics Info (English)</Label>
                <Textarea
                  id="logistics_info_en"
                  {...register("logistics_info_en")}
                  rows={4}
                  placeholder='{"ports": ["Tashkent"], "shipping_methods": ["Sea", "Rail"]}'
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 6: Market Index (only for existing products) */}
        <TabsContent value="market-index" className="space-y-4">
          {product ? (
            <MarketQuotesManager productId={product.id} />
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Save the product first to manage market quotes
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : product ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
