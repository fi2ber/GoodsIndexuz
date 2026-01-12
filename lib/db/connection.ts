// Загружаем переменные окружения для скриптов (если не загружены)
try {
  const dotenv = require("dotenv");
  const path = require("path");
  dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
} catch {
  // dotenv может быть не установлен, это нормально для Next.js runtime
}

import postgres from "postgres";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set. Please set it in .env.local file.");
}

// Create a single connection pool
export const sql = postgres(process.env.DATABASE_URL, {
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout
});

// Helper to safely close connections (useful for scripts)
export async function closeConnection() {
  await sql.end();
}

