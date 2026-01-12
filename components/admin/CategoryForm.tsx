"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateSlug } from "@/lib/utils/slug";
import type { Database } from "@/types/database";

type Category = Database["public"]["Tables"]["categories"]["Row"];

const categorySchema = z.object({
  name_ru: z.string().min(1, "Russian name is required"),
  name_en: z.string().min(1, "English name is required"),
  slug: z.string().min(1, "Slug is required"),
  description_ru: z.string().optional(),
  description_en: z.string().optional(),
  image_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: Category;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugWarning, setSlugWarning] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? {
          name_ru: category.name_ru,
          name_en: category.name_en,
          slug: category.slug,
          description_ru: category.description_ru || "",
          description_en: category.description_en || "",
          image_url: category.image_url || "",
          sort_order: category.sort_order || 0,
          is_active: category.is_active ?? true,
        }
      : {
          name_ru: "",
          name_en: "",
          slug: "",
          description_ru: "",
          description_en: "",
          image_url: "",
          sort_order: 0,
          is_active: true,
        },
  });

  const nameEn = watch("name_en");
  const slug = watch("slug");

  // Auto-generate slug when creating new category
  useEffect(() => {
    if (!category && nameEn) {
      const generatedSlug = generateSlug(nameEn);
      setValue("slug", generatedSlug);
    }
  }, [nameEn, category, setValue]);

  // Check slug uniqueness
  useEffect(() => {
    if (slug && slug.length > 0) {
      const checkSlug = async () => {
        try {
          const response = await fetch(
            `/api/admin/categories/check-slug?slug=${encodeURIComponent(slug)}${category?.id ? `&excludeId=${category.id}` : ""}`
          );
          const data = await response.json();
          if (!data.unique) {
            setSlugWarning("This slug is already in use");
          } else {
            setSlugWarning(null);
          }
        } catch {
          // Ignore errors
        }
      };

      const timeoutId = setTimeout(checkSlug, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [slug, category?.id]);

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const url = category
        ? `/api/admin/categories/${category.id}`
        : "/api/admin/categories";
      const method = category ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          image_url: data.image_url || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save category");
      }

      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name_ru">Name (Russian) *</Label>
          <Input
            id="name_ru"
            {...register("name_ru")}
            placeholder="Орехи"
          />
          {errors.name_ru && (
            <p className="text-sm text-destructive">{errors.name_ru.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name_en">Name (English) *</Label>
          <Input
            id="name_en"
            {...register("name_en")}
            placeholder="Nuts"
          />
          {errors.name_en && (
            <p className="text-sm text-destructive">{errors.name_en.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug *</Label>
        <Input
          id="slug"
          {...register("slug")}
          placeholder="nuts"
        />
        {errors.slug && (
          <p className="text-sm text-destructive">{errors.slug.message}</p>
        )}
        {slugWarning && (
          <p className="text-sm text-yellow-600">{slugWarning}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="description_ru">Description (Russian)</Label>
          <Textarea
            id="description_ru"
            {...register("description_ru")}
            placeholder="Описание категории на русском"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description_en">Description (English)</Label>
          <Textarea
            id="description_en"
            {...register("description_en")}
            placeholder="Category description in English"
            rows={4}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url">Image URL</Label>
        <Input
          id="image_url"
          type="url"
          {...register("image_url")}
          placeholder="https://example.com/image.jpg"
        />
        {errors.image_url && (
          <p className="text-sm text-destructive">{errors.image_url.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sort_order">Sort Order</Label>
          <Input
            id="sort_order"
            type="number"
            {...register("sort_order", { valueAsNumber: true })}
            placeholder="0"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_active"
            {...register("is_active")}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="is_active">Active</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : category ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}

