import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  host: "localhost",              // works with -p 5433:5432 mapping
  port: 5432,                     // your Docker port mapping
  user: "postgres",
  password: "pgforcss",     // ← THIS MUST MATCH your Docker command
  database: "parking_booking_db"
});

pool.on("connect", () => {
  console.log("🅿️ Parking DB connected successfully");
});

pool.on("error", (err) => {
  console.error("Parking DB pool error:", err);
});