import { pool } from "../db/index.js";
import { publishEvent } from "../messaging/eventPublisher.js";

export async function handleBookingCancelled(event) {
  const { bookingId, spotId } = event.payload;

  try {
    // 1. Free the spot
    await pool.query(
      "UPDATE parking_spots SET is_reserved = false WHERE id = $1",
      [spotId]
    );

    // 2. Remove reservation record
    await pool.query(
      "DELETE FROM reservations WHERE booking_id = $1",
      [bookingId]
    );

    // 3. Publish release event
    await publishEvent("parking.spot.released", {
      bookingId,
      spotId,
      timestamp: new Date().toISOString()
    });

    console.log(`Spot ${spotId} released after cancellation`);
  } catch (err) {
    console.error("Release spot error:", err);
  }
}