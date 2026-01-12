import { config } from "dotenv";
import { resolve } from "path";
import { readFileSync } from "fs";
import { sql, closeConnection } from "../lib/db/connection";

config({ path: resolve(process.cwd(), ".env.local") });

async function runMigration() {
  try {
    const migrationPath = resolve(
      process.cwd(),
      "supabase/migrations/013_create_market_index.sql"
    );
    const migrationSQL = readFileSync(migrationPath, "utf-8");

    console.log("Running migration 013: Create market index tables...");
    await sql.unsafe(migrationSQL);
    console.log("✅ Migration 013 completed successfully!");

    // Verify product_market_quotes table
    const quotesTableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'product_market_quotes'
      )
    `;
    if (quotesTableExists[0]?.exists) {
      console.log("\n✅ product_market_quotes table created successfully");
      
      // Show columns
      const quotesColumns = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'product_market_quotes'
        ORDER BY ordinal_position
      `;
      console.log("  Columns:");
      quotesColumns.forEach((col) => {
        console.log(`    - ${col.column_name} (${col.data_type})`);
      });
    }

    // Verify fx_rates_daily table
    const fxTableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'fx_rates_daily'
      )
    `;
    if (fxTableExists[0]?.exists) {
      console.log("\n✅ fx_rates_daily table created successfully");
      
      // Show columns
      const fxColumns = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'fx_rates_daily'
        ORDER BY ordinal_position
      `;
      console.log("  Columns:");
      fxColumns.forEach((col) => {
        console.log(`    - ${col.column_name} (${col.data_type})`);
      });
    }

  } catch (error: any) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  } finally {
    await closeConnection();
  }
}

runMigration();
