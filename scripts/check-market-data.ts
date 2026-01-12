import { config } from "dotenv";
import { resolve } from "path";
import { sql, closeConnection } from "../lib/db/connection";

config({ path: resolve(process.cwd(), ".env.local") });

async function checkMarketData() {
  try {
    console.log("🔍 Checking market data...\n");

    // 1. Check if tables exist
    console.log("1. Checking tables...");
    const tablesCheck = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('product_market_quotes', 'fx_rates_daily')
      ORDER BY table_name
    `;
    
    if (tablesCheck.length === 0) {
      console.log("❌ Tables don't exist! Run migration 013 first.");
      return;
    }
    console.log("✅ Tables exist:", tablesCheck.map(t => t.table_name).join(", "));

    // 2. Check products
    console.log("\n2. Checking products...");
    const products = await sql`
      SELECT id, name_ru, slug 
      FROM products 
      WHERE is_active = true 
      LIMIT 5
    `;
    console.log(`   Found ${products.length} active products`);
    if (products.length === 0) {
      console.log("❌ No active products found!");
      return;
    }

    // 3. Check market quotes
    console.log("\n3. Checking market quotes...");
    const quotesCount = await sql`
      SELECT COUNT(*)::int as count FROM product_market_quotes
    `;
    console.log(`   Total quotes: ${quotesCount[0]?.count || 0}`);

    if (quotesCount[0]?.count === 0) {
      console.log("❌ No market quotes found!");
      console.log("   💡 Add quotes in admin panel: /admin/products -> Edit -> Market Quotes");
    } else {
      // Check quotes per product
      const quotesPerProduct = await sql`
        SELECT 
          p.id,
          p.name_ru,
          COUNT(pmq.id)::int as quote_count
        FROM products p
        LEFT JOIN product_market_quotes pmq ON p.id = pmq.product_id
        WHERE p.is_active = true
        GROUP BY p.id, p.name_ru
        ORDER BY quote_count DESC
        LIMIT 10
      `;
      console.log("\n   Quotes per product:");
      quotesPerProduct.forEach((p: any) => {
        const status = p.quote_count >= 2 ? "✅" : "⚠️";
        console.log(`   ${status} ${p.name_ru}: ${p.quote_count} quotes`);
      });
    }

    // 4. Check FX rates
    console.log("\n4. Checking FX rates...");
    const fxCount = await sql`
      SELECT COUNT(*)::int as count FROM fx_rates_daily
    `;
    console.log(`   Total FX rates: ${fxCount[0]?.count || 0}`);

    if (fxCount[0]?.count === 0) {
      console.log("❌ No FX rates found!");
      console.log("   💡 Update rates in admin panel: /admin/fx-rates -> Update from CBU");
    } else {
      const latestFx = await sql`
        SELECT rate_date, usd_uzs, source 
        FROM fx_rates_daily 
        ORDER BY rate_date DESC 
        LIMIT 5
      `;
      console.log("\n   Latest FX rates:");
      latestFx.forEach((rate: any) => {
        console.log(`   ✅ ${rate.rate_date}: 1 USD = ${Number(rate.usd_uzs).toFixed(2)} UZS (${rate.source || 'manual'})`);
      });
    }

    // 5. Check specific product
    if (products.length > 0) {
      const testProduct = products[0];
      console.log(`\n5. Checking product: ${testProduct.name_ru} (${testProduct.slug})`);
      
      const productQuotes = await sql`
        SELECT quote_date, price_mid_usd, tolerance_usd
        FROM product_market_quotes
        WHERE product_id = ${testProduct.id}
        ORDER BY quote_date ASC
      `;
      
      console.log(`   Quotes: ${productQuotes.length}`);
      if (productQuotes.length > 0) {
        console.log("   Quote dates:");
        productQuotes.forEach((q: any) => {
          console.log(`     - ${q.quote_date}: $${Number(q.price_mid_usd).toFixed(3)}/kg ±$${Number(q.tolerance_usd).toFixed(3)}`);
        });

        // Check if FX rates exist for quote dates
        const quoteDates = productQuotes.map((q: any) => q.quote_date);
        const fxRatesForQuotes = await sql`
          SELECT rate_date, usd_uzs
          FROM fx_rates_daily
          WHERE rate_date = ANY(${quoteDates}::date[])
          ORDER BY rate_date
        `;
        
        console.log(`\n   FX rates for quote dates: ${fxRatesForQuotes.length}/${quoteDates.length}`);
        if (fxRatesForQuotes.length < quoteDates.length) {
          const missingDates = quoteDates.filter(
            (date: string) => !fxRatesForQuotes.some((fx: any) => fx.rate_date === date)
          );
          console.log(`   ⚠️ Missing FX rates for dates: ${missingDates.join(", ")}`);
          console.log("   💡 Add missing rates in /admin/fx-rates");
        }
      } else {
        console.log("   ❌ No quotes for this product!");
      }
    }

    console.log("\n✅ Check complete!");
    console.log("\n💡 To add data:");
    console.log("   1. Market quotes: /admin/products -> Edit product -> Market Quotes");
    console.log("   2. FX rates: /admin/fx-rates -> Update from CBU");

  } catch (error: any) {
    console.error("❌ Error:", error.message);
    if (error.code === '42P01') {
      console.error("   Tables don't exist. Run: npm run db:migrate:013");
    }
  } finally {
    await closeConnection();
  }
}

checkMarketData();
