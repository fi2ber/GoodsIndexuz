import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const envLocalPath = join(process.cwd(), ".env.local");
const envExamplePath = join(process.cwd(), "env.example");

function checkAndSetupEnv() {
  let envContent = "";

  if (existsSync(envLocalPath)) {
    try {
      envContent = readFileSync(envLocalPath, "utf-8");
    } catch (error) {
      console.log("⚠️  Не удалось прочитать .env.local");
    }
  }

  // Проверяем наличие DATABASE_URL
  if (!envContent.includes("DATABASE_URL=")) {
    console.log("⚠️  DATABASE_URL не найден в .env.local");
    
    if (existsSync(envExamplePath)) {
      const exampleContent = readFileSync(envExamplePath, "utf-8");
      const databaseUrlLine = exampleContent
        .split("\n")
        .find((line) => line.startsWith("DATABASE_URL="));

      if (databaseUrlLine) {
        console.log("\n📝 Добавьте следующую строку в .env.local:");
        console.log(databaseUrlLine);
        console.log("\n💡 Примеры DATABASE_URL:");
        console.log("   Локально: postgresql://postgres:password@localhost:5432/goodsindexuz");
        console.log("   Neon: postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require");
        console.log("   Railway: postgresql://postgres:pass@xxx.railway.app:5432/railway");
        console.log("\nПосле добавления DATABASE_URL запустите: npm run db:setup");
        process.exit(1);
      }
    }
    
    console.log("\n❌ Не удалось найти пример DATABASE_URL");
    console.log("Добавьте в .env.local:");
    console.log("DATABASE_URL=postgresql://user:password@host:port/database");
    process.exit(1);
  } else {
    console.log("✅ DATABASE_URL найден в .env.local");
    process.exit(0);
  }
}

checkAndSetupEnv();

