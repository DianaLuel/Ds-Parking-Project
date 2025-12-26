import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  host: "localhost",  // Change to "host.docker.internal" if connection fails on Windows
  port: 5432,  // Matches Docker -p 5433:5432
  user: "postgres",
  password: "pgforcss",  // Match what you set in Docker
  database: "parking_db"
});

pool.on("connect", () => {
  console.log("🅿️ Parking DB connected");
});
pool.on("error", (err) => {
  console.error("Parking DB pool error:", err);
});