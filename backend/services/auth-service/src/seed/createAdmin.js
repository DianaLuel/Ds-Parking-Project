import bcrypt from "bcrypt";
import { pool } from "../db/index.js";

export async function createAdminIfNotExists() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  const existing = await pool.query(
    "SELECT * FROM users WHERE role = 'ADMIN' LIMIT 1"
  );

  if (existing.rows.length > 0) {
    console.log("✅ Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await pool.query(
    `INSERT INTO users (username, email, password, role)
     VALUES ($1, $2, $3, 'ADMIN')`,
    ["admin", adminEmail, hashedPassword]
  );

  console.log("🚀 Admin user created automatically");
}
