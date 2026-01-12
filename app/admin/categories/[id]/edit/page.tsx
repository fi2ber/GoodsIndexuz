"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/CategoryForm";
import type { Database } from "@/types/database";

type Category = Database["public"]["Tables"]["categories"]["Row"];

export default function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [categoryId, setCategoryId] = useState<string | null>(null);

  useEffect(() => {
    async function loadParams() {
      const resolvedParams = await params;
      setCategoryId(resolvedParams.id);
    }
    loadParams();
  }, [params]);

  useEffect(() => {
    if (!categoryId) return;

    async function fetchCategory() {
      try {
        const response = await fetch(`/api/admin/categories/${categoryId}`);
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error("Failed to fetch category");
        }
        const data = await response.json();
        setCategory(data);
      } catch (error) {
        console.error("Error fetching category:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategory();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Edit Category</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Edit Category</h1>
        <p className="text-muted-foreground">Update category information</p>
      </div>

      <CategoryForm category={category} />
    </div>
  );
}

