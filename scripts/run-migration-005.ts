import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });
import { sql, closeConnection } from "../lib/db/connection";
import { readFileSync } from "fs";
import { join } from "path";

async function runMigration005() {
  try {
    console.log("🚀 Выполнение миграции 005_add_category_fields.sql...\n");
    const categorySQL = readFileSync(
      join(process.cwd(), "supabase/migrations/005_add_category_fields.sql"),
      "utf-8"
    );
    // Выполняем весь SQL файл как один запрос
    await sql.unsafe(categorySQL);
    console.log("✅ Миграция 005_add_category_fields.sql выполнена успешно!");
    await closeConnection();
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Ошибка при выполнении миграции:", error.message);
    await closeConnection();
    process.exit(1);
  }
}

runMigration005();

