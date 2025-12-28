import express from "express";
import bookingsRouter from "./routes/bookings.routes.js";

const app = express();

// CRITICAL: Parse JSON bodies — MUST be before routes
app.use(express.json());

// Mount the bookings routes
app.use("/bookings", bookingsRouter);

export default app;