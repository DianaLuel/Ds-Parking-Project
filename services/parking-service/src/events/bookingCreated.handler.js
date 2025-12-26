import { pool } from "../db/index.js";  // New import
import { publishEvent } from "../messaging/eventPublisher.js";

export async function handleBookingCreated(event) {
  const { bookingId, lotId } = event.payload;

  console.log("Received booking.created", event.payload);

  try {
    // 1. Find an available spot
    const spotResult = await pool.query(
      `SELECT * FROM parking_spots
       WHERE lot_id = $1 AND is_reserved = false
       LIMIT 1`,
      [lotId]
    );

    if (spotResult.rows.length === 0) {
      console.log("❌ No available parking spots in lot", lotId);
      return;  // Or throw error / publish failure event
    }

    const spot = spotResult.rows[0];

    // 2. Mark spot as reserved
    await pool.query(
      `UPDATE parking_spots
       SET is_reserved = true
       WHERE id = $1`,
      [spot.id]
    );

    // 3. Save reservation
    await pool.query(
      `INSERT INTO reservations (booking_id, spot_id)
       VALUES ($1, $2)`,
      [bookingId, spot.id]
    );

    // 4. Publish event
    await publishEvent("parking.spot.reserved", {
      bookingId,
      lotId,
      spotId: spot.id,
      timestamp: new Date().toISOString()
    });

    console.log(`🅿️ Spot ${spot.spot_number} reserved for booking ${bookingId}`);
  } catch (err) {
    console.error("Parking reservation error:", err);
    // Optional: Publish failure event
  }
}