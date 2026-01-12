import { config } from "dotenv";
import { resolve } from "path";
import { readFileSync } from "fs";
import { sql, closeConnection } from "../lib/db/connection";

config({ path: resolve(process.cwd(), ".env.local") });

async function runMigration() {
  try {
    const migrationPath = resolve(
      process.cwd(),
      "supabase/migrations/012_add_product_enhancements.sql"
    );
    const migrationSQL = readFileSync(migrationPath, "utf-8");

    console.log("Running migration 012: Add product enhancement fields...");
    await sql.unsafe(migrationSQL);
    console.log("✅ Migration 012 completed successfully!");

    // Verify columns were added
    const columns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'products' 
      AND column_name IN (
        'certificates_ru', 'certificates_en', 'seasonality', 
        'logistics_info_ru', 'logistics_info_en', 'video_url',
        'faqs_ru', 'faqs_en', 'view_count'
      )
      ORDER BY column_name
    `;
    console.log("\n✅ Verified new columns:");
    columns.forEach((col) => {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    });

    // Verify product_views table
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'product_views'
      )
    `;
    if (tableExists[0]?.exists) {
      console.log("\n✅ product_views table created successfully");
    }
  } catch (error: any) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  } finally {
    await closeConnection();
  }
}

runMigration();

