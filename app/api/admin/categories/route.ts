import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { sql } from "@/lib/db/connection";
import { z } from "zod";
import { generateSlug } from "@/lib/utils/slug";
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

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const includeDeleted = searchParams.get("include_deleted") === "true";

    let categories;
    if (includeDeleted) {
      categories = await sql`
        SELECT * FROM categories
        ORDER BY sort_order ASC, name_ru ASC
      `;
    } else {
      categories = await sql`
        SELECT * FROM categories
        WHERE deleted_at IS NULL
        ORDER BY sort_order ASC, name_ru ASC
      `;
    }

    return NextResponse.json(categories);
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const validated = categorySchema.parse(body);

    // Check slug uniqueness
    const [existing] = await sql`
      SELECT id FROM categories WHERE slug = ${validated.slug} AND deleted_at IS NULL
    `;

    if (existing) {
      return NextResponse.json(
        { error: "Category with this slug already exists" },
        { status: 400 }
      );
    }

    const [data] = await sql`
      INSERT INTO categories (
        name_ru,
        name_en,
        slug,
        description_ru,
        description_en,
        image_url,
        sort_order,
        is_active
      ) VALUES (
        ${validated.name_ru},
        ${validated.name_en},
        ${validated.slug},
        ${validated.description_ru || null},
        ${validated.description_en || null},
        ${validated.image_url || null},
        ${validated.sort_order},
        ${validated.is_active}
      )
      RETURNING *
    `;

    // Log audit event
    await logAuditEvent({
      userId: user.id,
      entityType: "category",
      entityId: data.id,
      action: "create",
      newData: data,
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("Error creating category:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to create category" },
      { status: 500 }
    );
  }
}

