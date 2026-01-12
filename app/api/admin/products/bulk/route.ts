import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { sql } from "@/lib/db/connection";
import { z } from "zod";

const bulkOperationSchema = z.object({
  ids: z.array(z.string().uuid()),
  operation: z.enum(["delete", "activate", "deactivate", "change_category"]),
  category_id: z.string().uuid().optional(),
});

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const validated = bulkOperationSchema.parse(body);

    const { ids, operation, category_id } = validated;

    if (ids.length === 0) {
      return NextResponse.json(
        { error: "No items selected" },
        { status: 400 }
      );
    }

    let result;
    let affectedCount = 0;

    switch (operation) {
      case "delete":
        // Hard delete - actually delete products
        result = await sql`
          DELETE FROM products
          WHERE id = ANY(${ids})
        `;
        affectedCount = result.count || 0;
        break;

      case "activate":
        result = await sql`
          UPDATE products
          SET is_active = true, updated_at = NOW()
          WHERE id = ANY(${ids})
        `;
        affectedCount = result.count || 0;
        break;

      case "deactivate":
        result = await sql`
          UPDATE products
          SET is_active = false, updated_at = NOW()
          WHERE id = ANY(${ids})
        `;
        affectedCount = result.count || 0;
        break;

      case "change_category":
        if (!category_id) {
          return NextResponse.json(
            { error: "category_id is required for change_category operation" },
            { status: 400 }
          );
        }
        result = await sql`
          UPDATE products
          SET category_id = ${category_id}, updated_at = NOW()
          WHERE id = ANY(${ids})
        `;
        affectedCount = result.count || 0;
        break;

      default:
        return NextResponse.json(
          { error: "Invalid operation" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      affectedCount,
      operation,
    });
  } catch (error: any) {
    console.error("Error performing bulk operation:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to perform bulk operation" },
      { status: 500 }
    );
  }
}
