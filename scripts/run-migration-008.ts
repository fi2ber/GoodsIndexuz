import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });
import { sql, closeConnection } from "../lib/db/connection";
import { readFileSync } from "fs";
import { join } from "path";

async function runMigration008() {
  try {
    console.log("🚀 Выполнение миграции 008_create_audit_logs.sql...\n");
    const auditSQL = readFileSync(
      join(process.cwd(), "supabase/migrations/008_create_audit_logs.sql"),
      "utf-8"
    );
    await sql.unsafe(auditSQL);
    console.log("✅ Миграция 008_create_audit_logs.sql выполнена успешно!");
    await closeConnection();
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Ошибка при выполнении миграции:", error.message);
    await closeConnection();
    process.exit(1);
  }
}

runMigration008();

