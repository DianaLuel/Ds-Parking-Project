import express from "express";
import {
  createBookingHandler,
  getBookingHandler,
  cancelBookingHandler
} from "../controllers/bookings.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate,createBookingHandler);
router.get("/:id", authenticate, getBookingHandler);
router.delete("/:id", authenticate, cancelBookingHandler);



export default router;
