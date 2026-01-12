import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });
import { sql, closeConnection } from "../lib/db/connection";
import { readFileSync } from "fs";
import { join } from "path";

async function runMigration010() {
  try {
    console.log("🚀 Выполнение миграции 010_update_submissions_phone.sql...\n");
    const migrationSQL = readFileSync(
      join(process.cwd(), "supabase/migrations/010_update_submissions_phone.sql"),
      "utf-8"
    );
    await sql.unsafe(migrationSQL);
    console.log("✅ Миграция 010_update_submissions_phone.sql выполнена успешно!");
    await closeConnection();
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Ошибка при выполнении миграции:", error.message);
    await closeConnection();
    process.exit(1);
  }
}

runMigration010();

