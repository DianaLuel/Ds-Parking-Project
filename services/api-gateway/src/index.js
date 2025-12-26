import express from "express";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();
app.use(express.json());

// Auth Service
app.use(
  "/auth",
  createProxyMiddleware({
    target: "http://localhost:3000",
    changeOrigin: true,
  })
);

// Booking Service
app.use(
  "/bookings",
  createProxyMiddleware({
    target: "http://localhost:3001",
    changeOrigin: true,
  })
);

// Parking Service (optional public endpoints)
app.use(
  "/parking",
  createProxyMiddleware({
    target: "http://localhost:3002",
    changeOrigin: true,
  })
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚪 API Gateway running on port ${PORT}`);
});