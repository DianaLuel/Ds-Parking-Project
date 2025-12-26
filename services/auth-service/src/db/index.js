// src/db/index.js
import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "auth_db",
  password: "pgforcss",
  port: 5432,
});
