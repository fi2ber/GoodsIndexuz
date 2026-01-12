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

  // Убеждаемся, что image_urls правильно парсится как массив строк
  let imageUrls: string[] = [];
  if (product.image_urls) {
    let parsedImages = product.image_urls;
    if (typeof parsedImages === 'string') {
      try {
        parsedImages = JSON.parse(parsedImages);
      } catch {
        parsedImages = [];
      }
    }
    
    if (Array.isArray(parsedImages)) {
      imageUrls = parsedImages.filter((url): url is string => typeof url === 'string');
    }
  }

  // Убеждаемся, что calibers правильно парсится как массив строк
  let caliberList: string[] = [];
  if (product.calibers) {
    let parsedCalibers = product.calibers;
    if (typeof parsedCalibers === 'string') {
      try {
        parsedCalibers = JSON.parse(parsedCalibers);
      } catch {
        parsedCalibers = [];
      }
    }
    
    if (Array.isArray(parsedCalibers)) {
      caliberList = parsedCalibers.filter((caliber): caliber is string => typeof caliber === 'string');
    }
  }

  const categories = await getAllCategories();

  // Create a clean product object for the form
  const cleanProduct = {
    ...product,
    image_urls: imageUrls,
    calibers: caliberList,
  };

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

