import { NextRequest, NextResponse } from "next/server";
import { getProductMarketSeries, getLatestProductMarketQuote } from "@/lib/db/queries";

// GET /api/products/[id]/market-series - Get market series for a product (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    const { searchParams } = new URL(request.url);
    
    const from = searchParams.get("from") || undefined;
    const to = searchParams.get("to") || undefined;

    const series = await getProductMarketSeries(productId, { from, to });
    const latestQuote = await getLatestProductMarketQuote(productId);

    return NextResponse.json({
      series,
      latestQuote: latestQuote ? {
        date: latestQuote.quote_date,
        priceMidUsd: Number(latestQuote.price_mid_usd),
        toleranceUsd: Number(latestQuote.tolerance_usd),
      } : null,
    });
  } catch (error: any) {
    console.error("Error fetching market series:", error);
    return NextResponse.json(
      { error: "Failed to fetch market series" },
      { status: 500 }
    );
  }
}
