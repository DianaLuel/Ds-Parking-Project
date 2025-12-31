import express from "express";
import authenticate from "../middleware/authenticate.js";
import isAdmin from "../middleware/isAdmin.js";
import { pool } from "../db/index.js";

const router = express.Router();

router.get('/lots', authenticate, isAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT l.id, l.name, l.total_spots, 
             COUNT(s.id) FILTER (WHERE s.status = 'RESERVED') AS reserved_spots
      FROM parking_lots l
      LEFT JOIN parking_spots s ON l.id = s.lot_id
      GROUP BY l.id
    `);
    rows.forEach(row => {
      row.available_spots = row.total_spots - row.reserved_spots;
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new parking lot
router.post('/lots', authenticate, isAdmin, async (req, res) => {
  const { name, total_spots } = req.body;

  if (!name || !total_spots) {
    return res.status(400).json({ error: 'Name and total_spots are required' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO parking_lots (name, total_spots) VALUES ($1, $2) RETURNING *',
      [name, total_spots]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating parking lot:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a parking spot to a lot
router.post('/lots/:lotId/spots', authenticate, isAdmin, async (req, res) => {
  const { lotId } = req.params;
  const { spot_number, vehicle_type } = req.body;

  if (!spot_number) {
    return res.status(400).json({ error: 'Spot number is required' });
  }

  try {
    // Check if lot exists
    const lotCheck = await pool.query('SELECT id FROM parking_lots WHERE id = $1', [lotId]);
    if (lotCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Parking lot not found' });
    }

    // Check if spot number already exists in this lot
    const spotCheck = await pool.query(
      'SELECT id FROM parking_spots WHERE lot_id = $1 AND spot_number = $2',
      [lotId, spot_number]
    );
    if (spotCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Spot number already exists in this lot' });
    }

    const { rows } = await pool.query(
      'INSERT INTO parking_spots (lot_id, spot_number, vehicle_type, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [lotId, spot_number, vehicle_type || 'CAR', 'AVAILABLE']
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error adding parking spot:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;