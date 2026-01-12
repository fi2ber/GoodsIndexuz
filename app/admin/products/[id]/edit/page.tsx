import { notFound } from "next/navigation";
import { sql } from "@/lib/db/connection";
import { getAllCategories } from "@/lib/db/queries";
import { ProductForm } from "@/components/admin/ProductForm";
import type { Database } from "@/types/database";

type Product = Database["public"]["Tables"]["products"]["Row"];

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product] = await sql<Product[]>`
    SELECT * FROM products
    WHERE id = ${id}
    LIMIT 1
  `;

  if (!product) {
    notFound();
  }

  // Убеждаемся, что все JSONB поля правильно парсятся
  const parseJsonField = (field: any, defaultValue: any) => {
    if (!field) return defaultValue;
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch {
        return defaultValue;
      }
    }
    return Array.isArray(field) || (typeof field === 'object' && field !== null) ? field : defaultValue;
  };

  const cleanProduct = {
    ...product,
    image_urls: parseJsonField(product.image_urls, []),
    calibers: parseJsonField(product.calibers, []),
    certificates_ru: parseJsonField(product.certificates_ru, []),
    certificates_en: parseJsonField(product.certificates_en, []),
    seasonality: parseJsonField(product.seasonality, []),
    faqs_ru: parseJsonField(product.faqs_ru, []),
    faqs_en: parseJsonField(product.faqs_en, []),
    packaging_options: parseJsonField(product.packaging_options, []),
  };

  const categories = await getAllCategories();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground">Update product information</p>
      </div>

      <ProductForm product={cleanProduct as any} categories={categories} />
    </div>
  );
}

