import { config } from "dotenv";
import { resolve } from "path";

// Загружаем переменные окружения из .env.local
config({ path: resolve(process.cwd(), ".env.local") });

import { sql, closeConnection } from "../lib/db/connection";

async function createDefaultManager() {
  try {
    console.log("🚀 Создание менеджера по умолчанию...\n");

    // Проверяем, есть ли уже менеджер по умолчанию
    const [existingDefault] = await sql`
      SELECT * FROM managers
      WHERE is_default = true
      LIMIT 1
    `;

    if (existingDefault) {
      console.log("⚠️  Менеджер по умолчанию уже существует:");
      console.log(`   ID: ${existingDefault.id}`);
      console.log(`   Name: ${existingDefault.name}`);
      console.log(`   Telegram: @${existingDefault.telegram_username}`);
      console.log("\n💡 Чтобы создать нового, сначала отредактируйте существующего через админ-панель.");
      await closeConnection();
      process.exit(0);
    }

    // Запрашиваем данные (в интерактивном режиме это не сработает, поэтому используем значения по умолчанию)
    const name = process.env.MANAGER_NAME || "Default Manager";
    const telegramUsername = process.env.MANAGER_TELEGRAM_USERNAME || "your_telegram_username";
    const telegramLink = process.env.MANAGER_TELEGRAM_LINK || `https://t.me/${telegramUsername}`;
    const email = process.env.MANAGER_EMAIL || null;
    const phone = process.env.MANAGER_PHONE || null;
    const whatsappLink = process.env.MANAGER_WHATSAPP_LINK || null;

    if (telegramUsername === "your_telegram_username") {
      console.log("⚠️  Используются значения по умолчанию!");
      console.log("💡 Чтобы указать свои значения, установите переменные окружения:");
      console.log("   MANAGER_NAME='Имя менеджера'");
      console.log("   MANAGER_TELEGRAM_USERNAME='username'");
      console.log("   MANAGER_TELEGRAM_LINK='https://t.me/username'");
      console.log("   MANAGER_EMAIL='manager@example.com' (опционально)");
      console.log("   MANAGER_PHONE='+1234567890' (опционально)");
      console.log("   MANAGER_WHATSAPP_LINK='https://wa.me/1234567890' (опционально)");
      console.log("\nИли создайте менеджера через админ-панель после входа.\n");
    }

    const [manager] = await sql`
      INSERT INTO managers (
        name,
        telegram_username,
        telegram_link,
        email,
        phone,
        whatsapp_link,
        is_active,
        is_default
      )
      VALUES (
        ${name},
        ${telegramUsername},
        ${telegramLink},
        ${email},
        ${phone},
        ${whatsappLink},
        true,
        true
      )
      RETURNING *
    `;

    console.log("✅ Менеджер по умолчанию создан:");
    console.log(`   ID: ${manager.id}`);
    console.log(`   Name: ${manager.name}`);
    console.log(`   Telegram: @${manager.telegram_username}`);
    console.log(`   Telegram Link: ${manager.telegram_link}`);
    if (manager.email) console.log(`   Email: ${manager.email}`);
    if (manager.phone) console.log(`   Phone: ${manager.phone}`);
    if (manager.whatsapp_link) console.log(`   WhatsApp: ${manager.whatsapp_link}`);
    console.log(`   Default: ${manager.is_default ? "Yes" : "No"}`);

    await closeConnection();
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Ошибка при создании менеджера:", error.message);
    if (error.message?.includes("relation") && error.message?.includes("does not exist")) {
      console.error("\n💡 Решение: Сначала выполните миграции:");
      console.error("   npx tsx scripts/run-migrations.ts");
    }
    await closeConnection();
    process.exit(1);
  }
}

createDefaultManager();


