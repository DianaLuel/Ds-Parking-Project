// index.js
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import { createAdminIfNotExists } from "./seed/createAdmin.js";
// console.log("Loaded JWT_SECRET:", process.env.JWT_SECRET);   // ← Add this line
// console.log("All env vars:", process.env);

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);
createAdminIfNotExists();

app.listen(3000, () =>
  console.log("Auth Service running on port 3000")
);
