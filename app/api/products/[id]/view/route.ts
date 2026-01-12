import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db/connection";
import { headers } from "next/headers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const headersList = await headers();
    const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || 
                      headersList.get("x-real-ip") || 
                      "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";

    // Check if this IP already viewed this product today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [existingView] = await sql`
      SELECT id FROM product_views
      WHERE product_id = ${id}
        AND ip_address = ${ipAddress}
        AND viewed_at >= ${today.toISOString()}
      LIMIT 1
    `;

    // If already viewed today, don't count again
    if (existingView) {
      return NextResponse.json({ success: true, alreadyCounted: true });
    }

    // Insert new view
    await sql`
      INSERT INTO product_views (product_id, ip_address, user_agent)
      VALUES (${id}, ${ipAddress}, ${userAgent})
    `;

    // Update view_count in products table
    await sql`
      UPDATE products
      SET view_count = COALESCE(view_count, 0) + 1
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error tracking product view:", error);
    // Don't fail the request if tracking fails
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

