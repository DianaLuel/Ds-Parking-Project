import {
  createBooking,
  getBookingById,
  cancelBooking
} from "../data/bookings.store.js";
import { publishEvent } from "../messaging/eventPublisher.js";
import { pool } from "../db/index.js";


export async function createBookingHandler(req, res) {
  const { lotId, spotId } = req.body;
  const userId = req.user.userId;  // From JWT

  if (!lotId || !userId) {
    return res.status(400).json({ error: "lotId and userId are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO bookings (user_id, lot_id, spot_id, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, lotId, spotId || null, "pending"]
    );

    const booking = result.rows[0];

    // Publish event (keep this)
    await publishEvent("booking.created", {
      bookingId: booking.id,
      userId,
      lotId,
      spotId: booking.spot_id,
      timestamp: booking.created_at,
      status: booking.status
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error("Create booking error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getBookingHandler(req, res) {
  const { id } = req.params;
  const userId = req.user.userId;  // Only allow user's own bookings

  try {
    const result = await pool.query(
      `SELECT * FROM bookings WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Get booking error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function cancelBookingHandler(req, res) {
  const { id } = req.params;
  const userId = req.user.userId;  // Only allow user's own bookings

  try {
    const result = await pool.query(
      `UPDATE bookings
       SET status = 'cancelled'
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const booking = result.rows[0];

    // Publish new event
    await publishEvent("booking.cancelled", {
      bookingId: booking.id,
      userId,
      lotId: booking.lot_id,
      spotId: booking.spot_id,
      timestamp: new Date().toISOString(),
      reason: "user_cancel"
    });

    res.json({ message: "Booking cancelled", booking });
  } catch (err) {
    console.error("Cancel booking error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
