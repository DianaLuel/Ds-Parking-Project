// ./routes/adminRoutes.js

import express from "express";
import authenticate from "../middleware/authenticate.js";   // ← already fixed
import isAdmin from "../middleware/isAdmin.js";
import { pool } from "../db/index.js";
import { publishEvent } from "../messaging/eventPublisher.js";  // ← Add this import

const router = express.Router();

// View all bookings
router.get("/bookings", authenticate, isAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM bookings ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Cancel any booking
router.delete("/bookings/:id", authenticate, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query("SELECT * FROM bookings WHERE id = $1", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const booking = rows[0];

    await pool.query("UPDATE bookings SET status = 'CANCELLED' WHERE id = $1", [id]);

    // Publish events
    publishEvent("booking.cancelled", { bookingId: id });
    publishEvent("parking.spot.released", { bookingId: id, lotId: booking.lot_id, spotId: booking.spot_id });

    res.json({ message: "Booking cancelled by admin" });
  } catch (err) {
    console.error("Error cancelling booking:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;