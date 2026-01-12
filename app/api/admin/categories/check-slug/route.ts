import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { sql } from "@/lib/db/connection";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = request.nextUrl.searchParams;
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
        SELECT id FROM categories 
        WHERE slug = ${slug} 
          AND id != ${excludeId}
          AND deleted_at IS NULL
        LIMIT 1
      `;
    } else {
      query = sql`
        SELECT id FROM categories 
        WHERE slug = ${slug} 
          AND deleted_at IS NULL
        LIMIT 1
      `;
    }

    const [existing] = await query;

    return NextResponse.json({ unique: !existing });
  } catch (error: any) {
    console.error("Error checking slug:", error);
    return NextResponse.json(
      { error: error.message || "Failed to check slug" },
      { status: 500 }
    );
  }
}

