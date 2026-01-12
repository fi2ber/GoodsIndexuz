import { config } from "dotenv";
import { resolve } from "path";
import { sql, closeConnection } from "../lib/db/connection";

config({ path: resolve(process.cwd(), ".env.local") });

/**
 * Fetches USD/UZS rate from Central Bank of Uzbekistan (CBU)
 * API: https://cbu.uz/oz/arkhiv-kursov-valyut/json/
 */
async function fetchCBURate(): Promise<{ rate: number; date: string } | null> {
  try {
    // CBU provides rates in JSON format
    // USD code is 840
    const response = await fetch("https://cbu.uz/oz/arkhiv-kursov-valyut/json/USD/");
    
    if (!response.ok) {
      throw new Error(`CBU API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid response from CBU API");
    }
    
    const usdData = data[0];
    const rate = parseFloat(usdData.Rate);
    const date = usdData.Date; // Format: DD.MM.YYYY
    
    // Convert date to YYYY-MM-DD
    const [day, month, year] = date.split(".");
    const isoDate = `${year}-${month}-${day}`;
    
    return { rate, date: isoDate };
  } catch (error) {
    console.error("Error fetching CBU rate:", error);
    return null;
  }
}

/**
 * Alternative: Fetch from openexchangerates.org (requires API key)
 * Uncomment if CBU is unreliable
 */
// async function fetchOpenExchangeRate(): Promise<{ rate: number; date: string } | null> {
//   const apiKey = process.env.OPENEXCHANGERATES_API_KEY;
//   if (!apiKey) {
//     console.error("OPENEXCHANGERATES_API_KEY not set");
//     return null;
//   }
//   
//   try {
//     const response = await fetch(
//       `https://openexchangerates.org/api/latest.json?app_id=${apiKey}&symbols=UZS`
//     );
//     
//     if (!response.ok) {
//       throw new Error(`API returned ${response.status}`);
//     }
//     
//     const data = await response.json();
//     const rate = data.rates.UZS;
//     const timestamp = data.timestamp;
//     const date = new Date(timestamp * 1000).toISOString().split("T")[0];
//     
//     return { rate, date };
//   } catch (error) {
//     console.error("Error fetching rate:", error);
//     return null;
//   }
// }

async function updateFxRate() {
  console.log("Updating USD/UZS exchange rate...");
  
  const rateData = await fetchCBURate();
  
  if (!rateData) {
    console.error("Failed to fetch exchange rate");
    process.exit(1);
  }
  
  console.log(`Fetched rate: 1 USD = ${rateData.rate} UZS (${rateData.date})`);
  
  try {
    // Upsert the rate (insert or update if exists)
    const [result] = await sql`
      INSERT INTO fx_rates_daily (rate_date, usd_uzs, source)
      VALUES (${rateData.date}::date, ${rateData.rate}, 'CBU')
      ON CONFLICT (rate_date) DO UPDATE SET
        usd_uzs = EXCLUDED.usd_uzs,
        source = EXCLUDED.source
      RETURNING *
    `;
    
    console.log(`✅ Rate saved: ${result.rate_date} = ${result.usd_uzs} UZS`);
    
    // Also log the total count
    const [count] = await sql`SELECT COUNT(*)::int as count FROM fx_rates_daily`;
    console.log(`Total rates in database: ${count?.count || 0}`);
    
  } catch (error: any) {
    console.error("❌ Failed to save rate:", error.message);
    process.exit(1);
  } finally {
    await closeConnection();
  }
}

updateFxRate();
