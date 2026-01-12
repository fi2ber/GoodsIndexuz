import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { sql } from "@/lib/db/connection";
import { z } from "zod";
import { logAuditEvent } from "@/lib/audit/logger";

const categorySchema = z.object({
  name_ru: z.string().min(1, "Russian name is required"),
  name_en: z.string().min(1, "English name is required"),
  slug: z.string().min(1, "Slug is required"),
  description_ru: z.string().optional(),
  description_en: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal("")),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();

    const { id } = await params;
    const [category] = await sql`
      SELECT * FROM categories
      WHERE id = ${id} AND deleted_at IS NULL
      LIMIT 1
    `;

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error: any) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch category" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();

    const { id } = await params;
    const body = await request.json();
    const validated = categorySchema.parse(body);

    // Check if category exists and get old data
    const [oldCategory] = await sql`
      SELECT * FROM categories WHERE id = ${id} AND deleted_at IS NULL
    `;

    if (!oldCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check slug uniqueness (excluding current category)
    const [slugConflict] = await sql`
      SELECT id FROM categories 
      WHERE slug = ${validated.slug} 
        AND id != ${id} 
        AND deleted_at IS NULL
    `;

    if (slugConflict) {
      return NextResponse.json(
        { error: "Category with this slug already exists" },
        { status: 400 }
      );
    }

    const [data] = await sql`
      UPDATE categories SET
        name_ru = ${validated.name_ru},
        name_en = ${validated.name_en},
        slug = ${validated.slug},
        description_ru = ${validated.description_ru || null},
        description_en = ${validated.description_en || null},
        image_url = ${validated.image_url || null},
        sort_order = ${validated.sort_order},
        is_active = ${validated.is_active},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    // Log audit event
    await logAuditEvent({
      userId: user.id,
      entityType: "category",
      entityId: id,
      action: "update",
      oldData: oldCategory,
      newData: data,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error updating category:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();

    const { id } = await params;

    // Check if category exists and get data for audit
    const [category] = await sql`
      SELECT * FROM categories WHERE id = ${id} AND deleted_at IS NULL
    `;

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if category has products
    const [productsCount] = await sql`
      SELECT COUNT(*) as count FROM products 
      WHERE category_id = ${id} AND is_active = true
    `;

    if (productsCount && Number(productsCount.count) > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete category with active products",
          productCount: Number(productsCount.count),
        },
        { status: 400 }
      );
    }

    // Soft delete
    await sql`
      UPDATE categories 
      SET deleted_at = NOW()
      WHERE id = ${id}
    `;

    // Log audit event
    await logAuditEvent({
      userId: user.id,
      entityType: "category",
      entityId: id,
      action: "delete",
      oldData: category,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete category" },
      { status: 500 }
    );
  }
}

