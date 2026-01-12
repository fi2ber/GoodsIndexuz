// Загружаем переменные окружения для скриптов (если не загружены)
try {
  const dotenv = require("dotenv");
  const path = require("path");
  dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
} catch {
  // dotenv может быть не установлен, это нормально для Next.js runtime
}

import postgres from "postgres";
import type { Sql } from "postgres";

let _sql: Sql | null = null;

// Lazy initialization of database connection
function getConnection(): Sql {
  if (_sql) return _sql;
  
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set. Please set it in .env.local file.");
  }
  
  _sql = postgres(process.env.DATABASE_URL, {
    max: 10, // Maximum number of connections
    idle_timeout: 20, // Close idle connections after 20 seconds
    connect_timeout: 10, // Connection timeout
  });
  
  return _sql;
}

// Export a proxy that will initialize the connection on first use
export const sql = new Proxy({} as Sql, {
  get(target, prop) {
    const connection = getConnection();
    const value = (connection as any)[prop];
    return typeof value === 'function' ? value.bind(connection) : value;
  },
  apply(target, thisArg, args) {
    const connection = getConnection();
    return (connection as any)(...args);
  }
});

// Helper to safely close connections (useful for scripts)
export async function closeConnection() {
  if (_sql) {
    await _sql.end();
    _sql = null;
  }
}

