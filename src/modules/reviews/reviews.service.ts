import { prisma } from "../../lib/prisma";

const createReview = async (
  userId: string,
  payload: {
    tutorId: string;
    bookingId: string;
    rating: number;
    comment: string;
  },
) => {
  const { tutorId, bookingId, rating, comment } = payload;

  // Find student profile using logged-in user
  const student = await prisma.studentProfile.findUnique({
    where: { userId },
  });

  if (!student) {
    throw new Error("Student profile not found");
  }

  // Check booking exists
  const booking = await prisma.bookings.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  // Prevent duplicate review
  const existing = await prisma.reviews.findUnique({
    where: { bookingId },
  });

  if (existing) {
    throw new Error("Review already submitted for this booking");
  }

  return prisma.reviews.create({
    data: {
      studentId: student.id,
      tutorId,
      bookingId,
      rating,
      comment,
    },
    include: {
      student: true,
      tutor: true,
      booking: true,
    },
  });
};

const getAllReviews = async () => {
  return prisma.reviews.findMany({
    include: {
      student: true,
      tutor: true,
      booking: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const getTutorReviews = async (tutorId: string) => {
  return prisma.reviews.findMany({
    where: { tutorId },
    include: { student: true, booking: true },
    orderBy: { createdAt: "desc" },
  });
};

const getStudentReviews = async (studentId: string) => {
  return prisma.reviews.findMany({
    where: { studentId },
    include: { tutor: true, booking: true },
    orderBy: { createdAt: "desc" },
  });
};

const getBookingReview = async (bookingId: string) => {
  return prisma.reviews.findUnique({
    where: { bookingId },
    include: { student: true, tutor: true },
  });
};

export const ReviewService = {
  createReview,
  getAllReviews,
  getTutorReviews,
  getStudentReviews,
  getBookingReview,
};
