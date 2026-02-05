import express from "express";

import authMiddle, { UserRole } from "../../middlewares/auth";
import { bookingController } from "./bookings.controller";

const router = express.Router();

router.post(
  "/create-booking",
  authMiddle(UserRole.student),
  bookingController.createBooking,
);

export const bookingRoutes = router;
