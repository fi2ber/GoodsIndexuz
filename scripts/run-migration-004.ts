import { config } from "dotenv";
import { resolve } from "path";

// Загружаем переменные окружения из .env.local
config({ path: resolve(process.cwd(), ".env.local") });

import { sql, closeConnection } from "../lib/db/connection";
import { readFileSync } from "fs";
import { join } from "path";

async function runMigration004() {
  try {
    console.log("🚀 Выполнение миграции 004_add_manager_contacts.sql...\n");

    // Выполняем ALTER TABLE как один запрос
    console.log("📦 Добавление колонок email, phone, whatsapp_link...");
    try {
      await sql`
        ALTER TABLE managers
          ADD COLUMN IF NOT EXISTS email TEXT,
          ADD COLUMN IF NOT EXISTS phone TEXT,
          ADD COLUMN IF NOT EXISTS whatsapp_link TEXT
      `;
      console.log("✅ Колонки добавлены успешно");
    } catch (error: any) {
      if (
        error.message?.includes("already exists") ||
        error.message?.includes("duplicate column")
      ) {
        console.log("⚠️  Колонки уже существуют, пропускаем");
      } else {
        throw error;
      }
    }

    // Добавляем комментарии (опционально, не критично)
    console.log("📦 Добавление комментариев...");
    try {
      await sql.unsafe(`COMMENT ON COLUMN managers.email IS 'Email address of the manager'`);
      await sql.unsafe(`COMMENT ON COLUMN managers.phone IS 'Phone number of the manager'`);
      await sql.unsafe(`COMMENT ON COLUMN managers.whatsapp_link IS 'WhatsApp link (e.g., https://wa.me/1234567890)'`);
      console.log("✅ Комментарии добавлены");
    } catch (error: any) {
      console.log("⚠️  Предупреждение при добавлении комментариев (не критично):", error.message);
    }
    
    console.log("\n✅ Миграция 004_add_manager_contacts.sql выполнена успешно!");
    await closeConnection();
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Ошибка при выполнении миграции:", error.message);
    await closeConnection();
    process.exit(1);
  }
}

runMigration004();

