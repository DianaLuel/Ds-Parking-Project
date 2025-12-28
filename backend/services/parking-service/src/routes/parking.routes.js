import express from "express";
import { pool } from "../db/index.js";

const router = express.Router();

router.get("/lots", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT lot_id,
             COUNT(*) AS total_spots,
             COUNT(*) FILTER (WHERE is_reserved = false) AS available
      FROM parking_spots
      GROUP BY lot_id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/lots/:lotId", async (req, res) => {
  const { lotId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM parking_spots WHERE lot_id = $1",
      [lotId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
