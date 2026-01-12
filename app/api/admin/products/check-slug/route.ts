import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { sql } from "@/lib/db/connection";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const excludeId = searchParams.get("excludeId");

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    let query;
    if (excludeId) {
      query = sql`
        SELECT COUNT(*) as count
        FROM products
        WHERE slug = ${slug} AND id != ${excludeId}
      `;
    } else {
      query = sql`
        SELECT COUNT(*) as count
        FROM products
        WHERE slug = ${slug}
      `;
    }

    const [result] = await query;
    const count = typeof result.count === 'string' ? parseInt(result.count, 10) : Number(result.count);
    const unique = count === 0;

    return NextResponse.json({ unique });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Check slug error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

