import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const envLocalPath = resolve(process.cwd(), ".env.local");

console.log("🔍 Проверка DATABASE_URL...\n");

if (!existsSync(envLocalPath)) {
  console.error("❌ Файл .env.local не найден!");
  console.log("\n💡 Создайте файл .env.local со следующим содержимым:");
  console.log("DATABASE_URL=postgresql://user:password@host:port/database");
  console.log("NEXT_PUBLIC_SITE_URL=http://localhost:3000");
  process.exit(1);
}

try {
  const envContent = readFileSync(envLocalPath, "utf-8");
  
  if (!envContent.includes("DATABASE_URL=")) {
    console.error("❌ DATABASE_URL не найден в .env.local!");
    console.log("\n💡 Добавьте следующую строку в .env.local:");
    console.log("DATABASE_URL=postgresql://user:password@host:port/database");
    console.log("\n📋 Примеры:");
    console.log("   Локально: postgresql://postgres:password@localhost:5432/goodsindexuz");
    console.log("   Neon: postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require");
    process.exit(1);
  }

  const databaseUrlLine = envContent
    .split("\n")
    .find((line) => line.trim().startsWith("DATABASE_URL="));

  if (databaseUrlLine) {
    const url = databaseUrlLine.split("=")[1]?.trim();
    if (!url || url === "") {
      console.error("❌ DATABASE_URL пустой!");
      process.exit(1);
    }
    
    // Проверяем только явные placeholder'ы
    if (url.includes("user:password@") || url === "postgresql://user:password@host:port/database") {
      console.error("❌ DATABASE_URL содержит placeholder!");
      console.log("\n💡 Замените placeholder на реальные данные подключения к PostgreSQL");
      console.log("Текущее значение:", databaseUrlLine);
      process.exit(1);
    }
    
    console.log("✅ DATABASE_URL найден в .env.local");
    console.log("   URL:", url.replace(/:[^:@]+@/, ":****@") + "\n"); // Скрываем пароль
    process.exit(0);
  }
} catch (error: any) {
  console.error("❌ Ошибка при чтении .env.local:", error.message);
  process.exit(1);
}

