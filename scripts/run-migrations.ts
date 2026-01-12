import { config } from "dotenv";
import { resolve } from "path";

// Загружаем переменные окружения из .env.local
config({ path: resolve(process.cwd(), ".env.local") });

import { sql, closeConnection } from "../lib/db/connection";
import { readFileSync } from "fs";
import { join } from "path";

async function runMigrations() {
  try {
    console.log("🚀 Начало выполнения миграций...\n");

    // Миграция 1: Схема БД
    console.log("📦 Выполнение миграции 001_initial_schema.sql...");
    const schemaSQL = readFileSync(
      join(process.cwd(), "supabase/migrations/001_initial_schema.sql"),
      "utf-8"
    );
    
    // Разделяем SQL на отдельные запросы (по ;)
    const schemaStatements = schemaSQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    for (const statement of schemaStatements) {
      if (statement.trim()) {
        try {
          await sql.unsafe(statement);
        } catch (error: any) {
          // Игнорируем ошибки "already exists" для расширений и объектов
          if (
            !error.message?.includes("already exists") &&
            !error.message?.includes("duplicate key")
          ) {
            console.warn(`⚠️  Предупреждение: ${error.message}`);
          }
        }
      }
    }
    console.log("✅ Миграция 001_initial_schema.sql выполнена\n");

    // Миграция 2: Категории
    console.log("📦 Выполнение миграции 003_seed_categories.sql...");
    const categoriesSQL = readFileSync(
      join(process.cwd(), "supabase/migrations/003_seed_categories.sql"),
      "utf-8"
    );

    try {
      await sql.unsafe(categoriesSQL);
    } catch (error: any) {
      if (!error.message?.includes("duplicate key")) {
        console.warn(`⚠️  Предупреждение: ${error.message}`);
      }
    }
    console.log("✅ Миграция 003_seed_categories.sql выполнена\n");

    // Миграция 3: Добавление полей контактов для менеджеров
    console.log("📦 Выполнение миграции 004_add_manager_contacts.sql...");
    try {
      const contactsSQL = readFileSync(
        join(process.cwd(), "supabase/migrations/004_add_manager_contacts.sql"),
        "utf-8"
      );
      
      // Разделяем SQL на отдельные запросы (по ;)
      const contactsStatements = contactsSQL
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !s.startsWith("--"));

      for (const statement of contactsStatements) {
        if (statement.trim()) {
          try {
            await sql.unsafe(statement);
          } catch (error: any) {
            // Игнорируем ошибки "already exists" для колонок
            if (
              !error.message?.includes("already exists") &&
              !error.message?.includes("duplicate column")
            ) {
              console.warn(`⚠️  Предупреждение: ${error.message}`);
            }
          }
        }
      }
      console.log("✅ Миграция 004_add_manager_contacts.sql выполнена\n");
    } catch (error: any) {
      if (!error.message?.includes("duplicate column")) {
        console.warn(`⚠️  Предупреждение при выполнении миграции 004: ${error.message}`);
      }
    }

    // Проверка созданных таблиц
    console.log("🔍 Проверка созданных таблиц...");
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;
    console.log("✅ Созданные таблицы:");
    tables.forEach((table: any) => {
      console.log(`   - ${table.table_name}`);
    });

    console.log("\n✅ Все миграции выполнены успешно!");
    await closeConnection();
    process.exit(0);
  } catch (error) {
    console.error("❌ Ошибка при выполнении миграций:", error);
    await closeConnection();
    process.exit(1);
  }
}

runMigrations();

