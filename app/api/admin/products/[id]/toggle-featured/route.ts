import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { sql } from "@/lib/db/connection";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    // Получаем текущее значение is_featured
    const [current] = await sql<{ is_featured: boolean }[]>`
      SELECT is_featured FROM products WHERE id = ${id} LIMIT 1
    `;

    if (!current) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Переключаем значение
    const newValue = !current.is_featured;

    const [updated] = await sql`
      UPDATE products
      SET is_featured = ${newValue}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, is_featured
    `;

    return NextResponse.json({
      success: true,
      product: updated,
      message: `Product ${newValue ? "marked as" : "unmarked from"} featured`,
    });
  } catch (error: any) {
    console.error("Error toggling featured status:", error);
    return NextResponse.json(
      { error: error.message || "Failed to toggle featured status" },
      { status: 500 }
    );
  }
}

