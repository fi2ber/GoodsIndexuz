import { config } from "dotenv";
import { resolve } from "path";
import { readFileSync } from "fs";
import { sql, closeConnection } from "../lib/db/connection";

config({ path: resolve(process.cwd(), ".env.local") });

async function runMigration() {
  try {
    const migrationPath = resolve(
      process.cwd(),
      "supabase/migrations/014_add_product_delete_policy.sql"
    );
    const migrationSQL = readFileSync(migrationPath, "utf-8");

    console.log("Running migration 014: Add product delete policy...");
    await sql.unsafe(migrationSQL);
    console.log("✅ Migration 014 completed successfully!");

    // Verify policies exist
    const policies = await sql`
      SELECT policyname, cmd 
      FROM pg_policies 
      WHERE tablename = 'products' 
      ORDER BY policyname
    `;
    
    if (policies.length > 0) {
      console.log("\n✅ Product RLS policies:");
      policies.forEach((policy) => {
        console.log(`    - ${policy.policyname} (${policy.cmd})`);
      });
    }

  } catch (error: any) {
    console.error("❌ Migration failed:", error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  } finally {
    await closeConnection();
  }
}

runMigration();
