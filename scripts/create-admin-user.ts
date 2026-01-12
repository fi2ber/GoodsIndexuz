import { config } from "dotenv";
import { resolve } from "path";

// Загружаем переменные окружения из .env.local
config({ path: resolve(process.cwd(), ".env.local") });

import { sql, closeConnection } from "../lib/db/connection";
import { hashPassword } from "../lib/auth";

async function createAdminUser() {
  try {
    const email = "admin";
    const password = "admin";

    const passwordHash = await hashPassword(password);

    const [data] = await sql`
      INSERT INTO users (email, password_hash, role)
      VALUES (${email}, ${passwordHash}, 'admin')
      ON CONFLICT (email) DO NOTHING
      RETURNING *
    `;

    if (!data) {
      console.log("Admin user already exists");
      await closeConnection();
      process.exit(0);
    }

    console.log("Admin user created successfully:", data);
    await closeConnection();
    process.exit(0);
  } catch (error) {
    console.error("Unexpected error:", error);
    await closeConnection();
    process.exit(1);
  }
}

createAdminUser();

