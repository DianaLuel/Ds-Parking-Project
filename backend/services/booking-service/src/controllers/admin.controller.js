import pool from "../db.js";

export async function getAllBookings(req, res) {
  const result = await pool.query("SELECT * FROM bookings");
  res.json(result.rows);
}

export async function adminCancelBooking(req, res) {
  const { id } = req.params;

  await pool.query(
    "UPDATE bookings SET status = 'CANCELLED' WHERE id = $1",
    [id]
  );

  res.json({ message: "Booking cancelled by admin" });
}
