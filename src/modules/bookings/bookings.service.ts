import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/auth";

enum Availability {
  AVAILABLE,
  UNAVAILABLE,
}

// const createBooking = async (userId: string, payload: any) => {
//   const studentProfile = await prisma.studentProfile.findUnique({
//     where: { userId: userId },
//   });

//   const booking = await prisma.bookings.create({
//     data: {
//       studentId: studentProfile?.id as string,
//       tutorId: payload.tutorId as string,
//       date: new Date(payload.date),
//       startTime: new Date(payload.startTime),
//       endTime: new Date(payload.endTime),
//       price: payload.price,
//     },
//   });

//   return booking;
// };

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
      },
    });

    return data;
  }

  if (user.role === UserRole.student) {
    const data = await prisma.bookings.findMany({
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
      where: {
        tutor: {
          userId: user.id,
        },
      },
    });

    return data;
  }
};

export const bookingServices = {
  createBooking,
  getAllBookings,
};
