import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";
import {
  getMarketQuoteById,
  updateMarketQuote,
  deleteMarketQuote,
} from "@/lib/db/queries";

// GET /api/admin/market-quotes/[quoteId] - Get a single quote
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ quoteId: string }> }
) {
  try {
    await requireAuth();
    const { quoteId } = await params;

    const quote = await getMarketQuoteById(quoteId);

    if (!quote) {
      return NextResponse.json(
        { error: "Quote not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(quote);
  } catch (error: any) {
    console.error("Error fetching market quote:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch market quote" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}

const updateQuoteSchema = z.object({
  quote_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format").optional(),
  price_mid_usd: z.number().positive("Price must be positive").optional(),
  tolerance_usd: z.number().min(0).optional(),
  notes: z.string().optional().nullable(),
});

// PUT /api/admin/market-quotes/[quoteId] - Update a quote
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ quoteId: string }> }
) {
  try {
    await requireAuth();
    const { quoteId } = await params;

    const body = await request.json();
    const validated = updateQuoteSchema.parse(body);

    const quote = await updateMarketQuote(quoteId, {
      quote_date: validated.quote_date,
      price_mid_usd: validated.price_mid_usd,
      tolerance_usd: validated.tolerance_usd,
      notes: validated.notes ?? undefined,
    });

    if (!quote) {
      return NextResponse.json(
        { error: "Quote not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, quote });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    // Handle unique constraint violation (duplicate date)
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "A quote for this date already exists" },
        { status: 409 }
      );
    }

    console.error("Error updating market quote:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update market quote" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}

// DELETE /api/admin/market-quotes/[quoteId] - Delete a quote
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ quoteId: string }> }
) {
  try {
    await requireAuth();
    const { quoteId } = await params;

    const deleted = await deleteMarketQuote(quoteId);

    if (!deleted) {
      return NextResponse.json(
        { error: "Quote not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting market quote:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete market quote" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
