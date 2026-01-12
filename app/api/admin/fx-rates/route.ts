import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { upsertFxRate } from "@/lib/db/queries";
import { z } from "zod";
import { logAuditEvent } from "@/lib/audit/logger";

const fxRateSchema = z.object({
  rate_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  usd_uzs: z.number().positive("Rate must be positive"),
  source: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const validated = fxRateSchema.parse(body);

    const rate = await upsertFxRate({
      rate_date: validated.rate_date,
      usd_uzs: validated.usd_uzs,
      source: validated.source || "manual",
    });

    // Log audit event
    await logAuditEvent({
      userId: user.id,
      entityType: "fx_rate",
      entityId: rate.rate_date,
      action: "create",
      newData: rate,
    });

    return NextResponse.json({
      success: true,
      rate: {
        rate_date: rate.rate_date,
        usd_uzs: Number(rate.usd_uzs),
        source: rate.source,
      },
    });
  } catch (error: any) {
    console.error("Error saving FX rate:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to save FX rate" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { getAllFxRates } = await import("@/lib/db/queries");
    const rates = await getAllFxRates(100);
    
    return NextResponse.json(rates);
  } catch (error: any) {
    console.error("Error fetching FX rates:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch FX rates" },
      { status: 500 }
    );
  }
}
