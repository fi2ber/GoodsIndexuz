import { config } from "dotenv";
import { resolve } from "path";
import { subDays, format, addDays } from "date-fns";

// Загружаем переменные окружения из .env.local
config({ path: resolve(process.cwd(), ".env.local") });

import { sql, closeConnection } from "../lib/db/connection";
import { upsertFxRate } from "../lib/db/queries";

// Базовые цены для разных категорий (USD/кг)
const BASE_PRICES: Record<string, { min: number; max: number }> = {
  nuts: { min: 5, max: 15 },
  "dried-fruits": { min: 2, max: 8 },
  legumes: { min: 1, max: 4 },
};

// Базовый курс USD/UZS
const BASE_FX_RATE = 12500;

async function seedMarketData() {
  try {
    console.log("Starting market data seeding...");

    // Получаем все товары с их категориями
    const products = await sql<Array<{
      id: string;
      name_ru: string;
      category_id: string;
      categories: { slug: string };
    }>>`
      SELECT 
        p.id,
        p.name_ru,
        p.category_id,
        json_build_object('slug', c.slug) as categories
      FROM products p
      JOIN categories c ON p.category_id = c.id
      ORDER BY p.name_ru
    `;

    if (products.length === 0) {
      console.error("❌ No products found. Please run seed:products first.");
      await closeConnection();
      process.exit(1);
    }

    console.log(`Found ${products.length} products`);

    // 1. Создаем FX rates за последние 3 месяца (~90 дней)
    console.log("\n📊 Creating FX rates...");
    const today = new Date();
    const startDate = subDays(today, 90);
    let fxCreated = 0;
    let fxSkipped = 0;

    for (let i = 0; i < 90; i++) {
      const rateDate = addDays(startDate, i);
      const dateStr = format(rateDate, "yyyy-MM-dd");

      // Небольшие колебания курса (±100-200 UZS в день)
      const randomChange = (Math.random() - 0.5) * 200; // -100 to +100
      const usdUzs = BASE_FX_RATE + randomChange;

      try {
        await upsertFxRate({
          rate_date: dateStr,
          usd_uzs: Math.round(usdUzs * 100) / 100, // Округляем до 2 знаков
          source: "demo",
        });
        fxCreated++;
      } catch (error: any) {
        if (error.code === "23505") {
          // Уже существует
          fxSkipped++;
        } else {
          console.error(`Error creating FX rate for ${dateStr}:`, error.message);
        }
      }
    }

    console.log(`   Created: ${fxCreated} FX rates`);
    console.log(`   Skipped: ${fxSkipped} (already exist)`);

    // 2. Создаем market quotes для каждого товара
    console.log("\n📈 Creating market quotes...");
    let quotesCreated = 0;
    let quotesSkipped = 0;

    for (const product of products) {
      const categorySlug = (product.categories as any).slug;
      const priceRange = BASE_PRICES[categorySlug] || BASE_PRICES.nuts;

      // Базовая цена для этого товара (случайная в диапазоне категории)
      const basePrice =
        priceRange.min + Math.random() * (priceRange.max - priceRange.min);

      // Создаем 12 котировок (1 в неделю за 3 месяца)
      const weeksAgo = 12; // 12 недель назад
      const quoteDates: string[] = [];

      for (let week = 0; week < 12; week++) {
        const quoteDate = subDays(today, (weeksAgo - week) * 7);
        quoteDates.push(format(quoteDate, "yyyy-MM-dd"));
      }

      let productQuotesCreated = 0;
      let productQuotesSkipped = 0;

      for (const quoteDate of quoteDates) {
        // Небольшие колебания цены (±5% от базовой)
        const priceChange = (Math.random() - 0.5) * 0.1; // -5% to +5%
        const priceMidUsd = basePrice * (1 + priceChange);
        const toleranceUsd = 0.005;

        try {
          const result = await sql`
            INSERT INTO product_market_quotes (
              product_id,
              quote_date,
              incoterm,
              unit,
              price_mid_usd,
              tolerance_usd,
              notes
            ) VALUES (
              ${product.id},
              ${quoteDate}::date,
              'FOB',
              'USD_PER_KG',
              ${Math.round(priceMidUsd * 100000) / 100000}, -- Округляем до 5 знаков
              ${toleranceUsd},
              'Demo data'
            )
            ON CONFLICT (product_id, quote_date, incoterm, unit) DO NOTHING
            RETURNING id
          `;

          if (result && result.length > 0) {
            productQuotesCreated++;
            quotesCreated++;
          } else {
            productQuotesSkipped++;
            quotesSkipped++;
          }
        } catch (error: any) {
          if (error.code === "23505") {
            // Уже существует
            productQuotesSkipped++;
            quotesSkipped++;
          } else {
            console.error(
              `Error creating quote for ${product.name_ru} on ${quoteDate}:`,
              error.message
            );
          }
        }
      }

      console.log(
        `   ✅ ${product.name_ru}: ${productQuotesCreated} quotes created, ${productQuotesSkipped} skipped`
      );
    }

    console.log("\n📊 Summary:");
    console.log(`   FX Rates: ${fxCreated} created, ${fxSkipped} skipped`);
    console.log(
      `   Market Quotes: ${quotesCreated} created, ${quotesSkipped} skipped`
    );
    console.log(
      `   Total quotes per product: 12 (1 per week for 3 months)`
    );

    await closeConnection();
    process.exit(0);
  } catch (error) {
    console.error("Unexpected error:", error);
    await closeConnection();
    process.exit(1);
  }
}

seedMarketData();
