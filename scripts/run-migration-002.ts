import { config } from "dotenv";
import { resolve } from "path";

// Загружаем переменные окружения из .env.local
config({ path: resolve(process.cwd(), ".env.local") });

import { sql, closeConnection } from "../lib/db/connection";
import { readFileSync } from "fs";
import { join } from "path";

async function runMigration002() {
  try {
    console.log("🚀 Выполнение миграции 002_add_product_fields.sql...\n");
    const migrationSQL = readFileSync(
      join(process.cwd(), "supabase/migrations/002_add_product_fields.sql"),
      "utf-8"
    );
    
    // Разделяем SQL на отдельные запросы
    const statements = migrationSQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await sql.unsafe(statement);
        } catch (error: any) {
          // Игнорируем ошибки "already exists" для колонок и индексов
          if (
            !error.message?.includes("already exists") &&
            !error.message?.includes("duplicate column") &&
            !error.message?.includes("relation") &&
            !error.message?.includes("already exists")
          ) {
            throw error;
          } else {
            console.log(`⚠️  Пропущено (уже существует): ${statement.substring(0, 50)}...`);
          }
        }
      }
    }
    
    console.log("\n✅ Миграция 002_add_product_fields.sql выполнена успешно!");
    await closeConnection();
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Ошибка при выполнении миграции:", error.message);
    await closeConnection();
    process.exit(1);
  }
}

runMigration002();

