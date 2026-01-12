import { ProductForm } from "@/components/admin/ProductForm";
import { getAllCategories } from "@/lib/db/queries";

export default async function NewProductPage() {
  const categories = await getAllCategories();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">New Product</h1>
        <p className="text-muted-foreground">Create a new product in your catalog</p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}

