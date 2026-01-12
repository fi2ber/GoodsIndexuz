import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { sql } from "@/lib/db/connection";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const entityType = searchParams.get("entity_type");
    const entityId = searchParams.get("entity_id");
    const userId = searchParams.get("user_id");
    const action = searchParams.get("action");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    let query = sql`
      SELECT 
        al.*,
        u.email as user_email
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE 1=1
    `;

    if (entityType) {
      query = sql`${query} AND al.entity_type = ${entityType}`;
    }

    if (entityId) {
      query = sql`${query} AND al.entity_id = ${entityId}`;
    }

    if (userId) {
      query = sql`${query} AND al.user_id = ${userId}`;
    }

    if (action) {
      query = sql`${query} AND al.action = ${action}`;
    }

    query = sql`${query} ORDER BY al.created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const logs = await query;

    // Get total count
    let countQuery = sql`
      SELECT COUNT(*)::int as total
      FROM audit_logs al
      WHERE 1=1
    `;

    if (entityType) {
      countQuery = sql`${countQuery} AND al.entity_type = ${entityType}`;
    }

    if (entityId) {
      countQuery = sql`${countQuery} AND al.entity_id = ${entityId}`;
    }

    if (userId) {
      countQuery = sql`${countQuery} AND al.user_id = ${userId}`;
    }

    if (action) {
      countQuery = sql`${countQuery} AND al.action = ${action}`;
    }

    const [countResult] = await countQuery;
    const total = countResult?.total || 0;

    return NextResponse.json({
      logs,
      total,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error("Error fetching audit logs:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}

