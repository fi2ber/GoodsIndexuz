import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { sql } from "@/lib/db/connection";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [result] = await sql`
      SELECT COUNT(*)::int as count
      FROM notifications
      WHERE user_id = ${user.id} AND is_read = false
    `;

    return NextResponse.json({ count: result?.count || 0 });
  } catch (error: any) {
    console.error("Error fetching unread count:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch unread count" },
      { status: 500 }
    );
  }
}

