import { BookingsStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/auth";

enum Availability {
  AVAILABLE,
  UNAVAILABLE,
}

const createBooking = async (userId: string, payload: any) => {
  return await prisma.$transaction(async (tx) => {
    // Find student profile
    const studentProfile = await tx.studentProfile.findUnique({
      where: { userId },
    });

    if (!studentProfile) {
      throw new Error("Student profile not found");
    }

    // Check tutor availability
    const tutor = await tx.tutorProfile.findUnique({
      where: { id: payload.tutorId },
    });

    if (!tutor) {
      throw new Error("Tutor not found");
    }

    if (tutor.availability !== "AVAILABLE") {
      throw new Error("Tutor is currently unavailable for booking");
    }

    //  Create booking
    const booking = await tx.bookings.create({
      data: {
        studentId: studentProfile.id,
        tutorId: payload.tutorId,
        date: new Date(payload.date),
        startTime: new Date(payload.startTime),
        endTime: new Date(payload.endTime),
        price: payload.price,
      },
    });

    // Increment totalStudents
    await tx.tutorProfile.update({
      where: { id: payload.tutorId },
      data: {
        totalStudents: {
          increment: 1,
        },
        availability: "UNAVAILABLE",
      },
    });

    return booking;
  });
};

const getAllBookings = async (user: { id: string; role: UserRole }) => {
  if (user.role === UserRole.admin) {
    const data = await prisma.bookings.findMany({
      include: {
        student: true,
        tutor: true,
        reviews: true,
      },
    });

    return data;
  }

  if (user.role === UserRole.student) {
    const data = await prisma.bookings.findMany({
      include: {
        student: true,
        tutor: true,
        reviews: true,
      },
      where: {
        student: {
          userId: user.id,
        },
      },
    });

    return data;
  }

  if (user.role === UserRole.tutor) {
    const data = await prisma.bookings.findMany({
      include: {
        student: true,
        tutor: true,
        reviews: true,
      },
      where: {
        tutor: {
          userId: user.id,
        },
      },
    });

    return data;
  }
};

// export const updateBookingStatusService = async (
//   bookingId: string,
//   tutorId: string,
//   status: BookingsStatus,
// ) => {
//   // Verify the booking exists and belongs to this tutor
//   const booking = await prisma.bookings.findUnique({
//     where: { id: bookingId },
//   });

//   console.log("tutorId from JWT:", tutorId);
//   console.log("booking.tutorId:", booking?.tutorId);

//   if (!booking) {
//     throw new Error("Booking not found");
//   }

//   if (booking.tutorId !== tutorId) {
//     throw new Error("Unauthorized: This booking does not belong to you");
//   }

//   // Guard against invalid transitions
//   if (booking.status === BookingsStatus.CANCELLED) {
//     throw new Error("Cannot update a cancelled booking");
//   }

//   if (booking.status === BookingsStatus.COMPLETED) {
//     throw new Error("Cannot update a completed booking");
//   }

//   const updated = await prisma.bookings.update({
//     where: { id: bookingId },
//     data: { status },
//   });

//   return updated;
// };

export const updateBookingStatusService = async (
  bookingId: string,
  tutorId: string,
  status: BookingsStatus,
) => {
  const booking = await prisma.bookings.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.tutorId !== tutorId) {
    throw new Error("Unauthorized: This booking does not belong to you");
  }

  if (booking.status === BookingsStatus.CANCELLED) {
    throw new Error("Cannot update a cancelled booking");
  }

  if (booking.status === BookingsStatus.COMPLETED) {
    throw new Error("Cannot update a completed booking");
  }

  // ✅ Use transaction so both updates are atomic
  const [updated] = await prisma.$transaction([
    prisma.bookings.update({
      where: { id: bookingId },
      data: { status },
    }),

    // ✅ If completed or cancelled → tutor becomes AVAILABLE again
    ...(status === BookingsStatus.COMPLETED ||
    status === BookingsStatus.CANCELLED
      ? [
          prisma.tutorProfile.update({
            where: { id: tutorId },
            data: { availability: "AVAILABLE" },
          }),
        ]
      : []),
  ]);

  return updated;
};

export const bookingServices = {
  createBooking,
  getAllBookings,
  updateBookingStatusService,
};
