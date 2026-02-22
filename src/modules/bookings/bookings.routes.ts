import express from "express";

import authMiddle, { UserRole } from "../../middlewares/auth";
import { bookingController } from "./bookings.controller";

const router = express.Router();

router.post(
  "/create-booking",
  authMiddle(UserRole.student),
  bookingController.createBooking,
);

router.get(
  "/all-bookings",
  authMiddle(UserRole.admin, UserRole.student, UserRole.tutor),
  bookingController.getAllBookings,
);

router.patch(
  "/:bookingId/status",
  authMiddle(UserRole.tutor),
  bookingController.updateBookingStatusController,
);

export const bookingRoutes = router;
