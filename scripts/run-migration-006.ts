import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });
import { sql, closeConnection } from "../lib/db/connection";
import { readFileSync } from "fs";
import { join } from "path";

async function runMigration006() {
  try {
    console.log("🚀 Выполнение миграции 006_create_notifications.sql...\n");
    const notificationsSQL = readFileSync(
      join(process.cwd(), "supabase/migrations/006_create_notifications.sql"),
      "utf-8"
    );
    await sql.unsafe(notificationsSQL);
    console.log("✅ Миграция 006_create_notifications.sql выполнена успешно!");
    await closeConnection();
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Ошибка при выполнении миграции:", error.message);
    await closeConnection();
    process.exit(1);
  }
}

runMigration006();

