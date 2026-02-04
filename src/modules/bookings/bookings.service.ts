import { Bookings } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/auth";
import { studentService } from "../student/student.service";

const createBooking = async (payload: Bookings, userId: string) => {
  const isStudentProfile = await studentService.getStudentProfileById(userId);

  if (!isStudentProfile) {
    throw new Error("Student profile not found!");
  }

  const studentInfo = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (studentInfo?.role === UserRole.student) {
    throw new Error(
      "Only student can book a session not other user role have right!",
    );
  }

  const booking = await prisma.bookings.create({
    data: {
      ...payload,
    },
  });

  return booking;
};

export const bookingService = {
  createBooking,
};
