import { notFound } from "next/navigation";
import { sql } from "@/lib/db/connection";
import { getAllCategories } from "@/lib/db/queries";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product] = await sql`
    SELECT * FROM products
    WHERE id = ${id}
    LIMIT 1
  `;

  if (!product) {
    notFound();
  }

  // Убеждаемся, что image_urls правильно парсится как массив строк
  if (product.image_urls) {
    if (typeof product.image_urls === 'string') {
      try {
        product.image_urls = JSON.parse(product.image_urls);
      } catch {
        product.image_urls = [];
      }
    } else if (!Array.isArray(product.image_urls)) {
      product.image_urls = [];
    }
    // Фильтруем только строки
    product.image_urls = product.image_urls.filter((url): url is string => typeof url === 'string');
  } else {
    product.image_urls = [];
  }

  // Убеждаемся, что calibers правильно парсится как массив строк
  if (product.calibers) {
    if (typeof product.calibers === 'string') {
      try {
        product.calibers = JSON.parse(product.calibers);
      } catch {
        product.calibers = [];
      }
    } else if (!Array.isArray(product.calibers)) {
      product.calibers = [];
    }
    // Фильтруем только строки
    product.calibers = product.calibers.filter((caliber): caliber is string => typeof caliber === 'string');
  } else {
    product.calibers = [];
  }

  const categories = await getAllCategories();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground">Update product information</p>
      </div>

      <ProductForm product={product} categories={categories} />
    </div>
  );
}

