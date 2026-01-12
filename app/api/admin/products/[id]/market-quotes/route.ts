import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";
import {
  getAllProductMarketQuotes,
  createMarketQuote,
} from "@/lib/db/queries";

// GET /api/admin/products/[id]/market-quotes - List all quotes for a product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id: productId } = await params;

    const quotes = await getAllProductMarketQuotes(productId);

    return NextResponse.json(quotes);
  } catch (error: any) {
    console.error("Error fetching market quotes:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch market quotes" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}

const createQuoteSchema = z.object({
  quote_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"),
  price_mid_usd: z.number().positive("Price must be positive"),
  tolerance_usd: z.number().min(0).default(0.005),
  notes: z.string().optional(),
});

// POST /api/admin/products/[id]/market-quotes - Create a new quote
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: productId } = await params;

    const body = await request.json();
    const validated = createQuoteSchema.parse(body);

    const quote = await createMarketQuote({
      product_id: productId,
      quote_date: validated.quote_date,
      price_mid_usd: validated.price_mid_usd,
      tolerance_usd: validated.tolerance_usd,
      notes: validated.notes,
      created_by: user.id,
    });

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

    console.error("Error creating market quote:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create market quote" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
