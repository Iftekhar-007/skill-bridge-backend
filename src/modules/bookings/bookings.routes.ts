import express from "express";
import { bookingController } from "./bookings.controller";
import authMiddle, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/create-booking",
  authMiddle(UserRole.student),
  bookingController.createBooking,
);

export const bookingRoutes = router;
