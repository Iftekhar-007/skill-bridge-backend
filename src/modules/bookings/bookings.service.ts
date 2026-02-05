import { prisma } from "../../lib/prisma";

const createBooking = async (userId: string, payload: any) => {
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId: userId },
  });

  const booking = await prisma.bookings.create({
    data: {
      studentId: studentProfile?.id as string,
      tutorId: payload.tutorId as string,
      date: new Date(payload.date),
      startTime: new Date(payload.startTime),
      endTime: new Date(payload.endTime),
      price: payload.price,
    },
  });

  return booking;
};

export const bookingServices = {
  createBooking,
};
