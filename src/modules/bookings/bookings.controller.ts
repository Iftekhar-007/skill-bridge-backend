import { Request, Response } from "express";
import {
  bookingServices,
  updateBookingStatusService,
} from "./bookings.service";
import { UserRole } from "../../middlewares/auth";
import { BookingsStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const result = await bookingServices.createBooking(
      user?.id as string,
      req.body,
    );

    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const result = await bookingServices.getAllBookings({
      id: user?.id as string,
      role: user?.role as UserRole,
    });

    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
};

// const updateBookingStatusController = async (req: Request, res: Response) => {
//   try {
//     const { bookingId } = req.params;
//     const { status } = req.body;
//     const tutorId = req.user?.id; // from your auth middleware

//     if (!tutorId) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const validStatuses = Object.values(BookingsStatus);
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({
//         message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
//       });
//     }

//     const booking = await updateBookingStatusService(
//       bookingId as string,
//       tutorId,
//       status,
//     );

//     return res.status(200).json({
//       message: "Booking status updated successfully",
//       data: booking,
//     });
//   } catch (error: any) {
//     const isClientError =
//       error.message.startsWith("Unauthorized") ||
//       error.message.includes("not found") ||
//       error.message.startsWith("Cannot");

//     return res.status(isClientError ? 400 : 500).json({
//       message: error.message || "Internal server error",
//     });
//   }
// };

export const updateBookingStatusController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const userId = req.user?.id; // User.id from JWT

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ Resolve TutorProfile.id from User.id
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!tutorProfile) {
      return res.status(404).json({ message: "Tutor profile not found" });
    }

    const validStatuses = Object.values(BookingsStatus);
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const booking = await updateBookingStatusService(
      bookingId as string,
      tutorProfile.id, // ✅ TutorProfile.id, not User.id
      status,
    );

    return res.status(200).json({
      message: "Booking status updated successfully",
      data: booking,
    });
  } catch (error: any) {
    const isClientError =
      error.message.startsWith("Unauthorized") ||
      error.message.includes("not found") ||
      error.message.startsWith("Cannot");

    return res.status(isClientError ? 400 : 500).json({
      message: error.message || "Internal server error",
    });
  }
};
export const bookingController = {
  createBooking,
  getAllBookings,
  updateBookingStatusController,
};
