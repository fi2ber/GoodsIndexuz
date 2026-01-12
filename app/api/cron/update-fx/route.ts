import { NextRequest, NextResponse } from "next/server";
import { upsertFxRate } from "@/lib/db/queries";

/**
 * Cron endpoint to update USD/UZS exchange rate
 * 
 * Security: Requires CRON_SECRET in Authorization header
 * 
 * Usage:
 * - Vercel Cron: Add to vercel.json crons config
 * - External: GET /api/cron/update-fx with Authorization: Bearer YOUR_CRON_SECRET
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("Authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Fetch rate from CBU (Central Bank of Uzbekistan)
    const cbuResponse = await fetch(
      "https://cbu.uz/oz/arkhiv-kursov-valyut/json/USD/",
      { next: { revalidate: 0 } }
    );
    
    if (!cbuResponse.ok) {
      throw new Error(`CBU API returned ${cbuResponse.status}`);
    }
    
    const cbuData = await cbuResponse.json();
    
    if (!Array.isArray(cbuData) || cbuData.length === 0) {
      throw new Error("Invalid response from CBU API");
    }
    
    const usdData = cbuData[0];
    const rate = parseFloat(usdData.Rate);
    const date = usdData.Date; // Format: DD.MM.YYYY
    
    // Convert date to YYYY-MM-DD
    const [day, month, year] = date.split(".");
    const isoDate = `${year}-${month}-${day}`;
    
    // Save to database
    const savedRate = await upsertFxRate({
      rate_date: isoDate,
      usd_uzs: rate,
      source: "CBU",
    });
    
    return NextResponse.json({
      success: true,
      rate: {
        date: savedRate.rate_date,
        usd_uzs: Number(savedRate.usd_uzs),
        source: savedRate.source,
      },
    });
    
  } catch (error: any) {
    console.error("Error updating FX rate:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update FX rate" },
      { status: 500 }
    );
  }
}
