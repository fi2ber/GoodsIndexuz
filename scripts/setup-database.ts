import { config } from "dotenv";
import { resolve } from "path";

// Загружаем переменные окружения из .env.local
config({ path: resolve(process.cwd(), ".env.local") });

import { sql, closeConnection } from "../lib/db/connection";
import { hashPassword } from "../lib/auth";
import { readFileSync } from "fs";
import { join } from "path";

async function setupDatabase() {
  try {
    console.log("🚀 Настройка базы данных...\n");

    // 1. Проверка подключения
    console.log("1️⃣  Проверка подключения к БД...");
    await sql`SELECT 1`;
    console.log("✅ Подключение успешно\n");

    // 1.5. Проверка и выполнение миграций, если нужно
    console.log("1.5️⃣  Проверка структуры БД...");
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `;
    
    if (tables.length === 0) {
      console.log("⚠️  Таблицы не найдены. Выполняю миграции...\n");
      
      // Выполняем миграцию схемы
      console.log("📦 Выполнение миграции 001_initial_schema.sql...");
      const schemaSQL = readFileSync(
        join(process.cwd(), "supabase/migrations/001_initial_schema.sql"),
        "utf-8"
      );
      try {
        await sql.unsafe(schemaSQL);
        console.log("✅ Миграция схемы выполнена\n");
      } catch (error: any) {
        if (!error.message?.includes("already exists") && !error.message?.includes("already enabled")) {
          throw error;
        }
      }

      // Выполняем миграцию категорий
      console.log("📦 Выполнение миграции 003_seed_categories.sql...");
      const categoriesSQL = readFileSync(
        join(process.cwd(), "supabase/migrations/003_seed_categories.sql"),
        "utf-8"
      );
      try {
        await sql.unsafe(categoriesSQL);
        console.log("✅ Миграция категорий выполнена\n");
      } catch (error: any) {
        if (!error.message?.includes("duplicate key")) {
          throw error;
        }
      }
    } else {
      console.log(`✅ Найдено таблиц: ${tables.length}\n`);
    }

    // 2. Создание админ-пользователя
    console.log("2️⃣  Создание админ-пользователя...");
    const email = "admin";
    const password = "admin";
    const passwordHash = await hashPassword(password);

    const [adminUser] = await sql`
      INSERT INTO users (email, password_hash, role)
      VALUES (${email}, ${passwordHash}, 'admin')
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        role = EXCLUDED.role
      RETURNING *
    `;

    if (adminUser) {
      console.log(`✅ Админ-пользователь создан/обновлен:`);
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Role: ${adminUser.role}\n`);
    }

    // 3. Проверка категорий
    console.log("3️⃣  Проверка категорий...");
    const categories = await sql`SELECT * FROM categories`;
    if (categories.length === 0) {
      console.log("⚠️  Категории не найдены. Выполните миграцию 003_seed_categories.sql");
    } else {
      console.log(`✅ Найдено категорий: ${categories.length}`);
      categories.forEach((cat: any) => {
        console.log(`   - ${cat.name_ru} / ${cat.name_en}`);
      });
    }
    console.log();

    // 4. Проверка менеджеров
    console.log("4️⃣  Проверка менеджеров...");
    const managers = await sql`SELECT * FROM managers`;
    if (managers.length === 0) {
      console.log("⚠️  Менеджеры не найдены. Создайте менеджера через админ-панель или SQL.");
    } else {
      console.log(`✅ Найдено менеджеров: ${managers.length}`);
      const defaultManager = managers.find((m: any) => m.is_default);
      if (!defaultManager) {
        console.log("⚠️  Менеджер по умолчанию не установлен!");
      } else {
        console.log(`✅ Менеджер по умолчанию: ${defaultManager.name}`);
      }
    }
    console.log();

    // 5. Итоговая статистика
    console.log("📊 Статистика БД:");
    const [productsCount] = await sql`SELECT COUNT(*) as count FROM products`;
    const [inquiriesCount] = await sql`SELECT COUNT(*) as count FROM inquiries`;
    console.log(`   Продуктов: ${productsCount.count}`);
    console.log(`   Запросов: ${inquiriesCount.count}`);
    console.log();

    console.log("✅ Настройка базы данных завершена!");
    console.log("\n📋 Следующие шаги:");
    console.log("   1. Запустите проект: npm run dev");
    console.log("   2. Войдите в админ-панель: http://localhost:3000/admin/login");
    console.log("   3. Email: admin, Password: admin");
    console.log("   4. Создайте менеджера по умолчанию в админ-панели");
    console.log("   5. Добавьте продукты через админ-панель");

    await closeConnection();
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Ошибка при настройке БД:", error.message);
    if (error.message?.includes("relation") && error.message?.includes("does not exist")) {
      console.error("\n💡 Решение: Сначала выполните миграции:");
      console.error("   npx tsx scripts/run-migrations.ts");
    }
    await closeConnection();
    process.exit(1);
  }
}

setupDatabase();

