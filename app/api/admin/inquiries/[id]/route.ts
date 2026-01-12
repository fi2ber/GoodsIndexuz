import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { sql } from "@/lib/db/connection";
import { z } from "zod";
import { INQUIRY_STATUSES } from "@/lib/constants";

const statusSchema = z.object({
  status: z.enum([INQUIRY_STATUSES.NEW, INQUIRY_STATUSES.CONTACTED, INQUIRY_STATUSES.CLOSED]),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();

    const { id } = await params;
    const body = await request.json();
    const validated = statusSchema.parse(body);

    const [data] = await sql`
      UPDATE inquiries
      SET status = ${validated.status}
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json({ success: true, inquiry: data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Inquiry update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

