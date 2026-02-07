import { Request, Response } from "express";
import { ReviewService } from "./reviews.service";

const createReview = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const result = await ReviewService.createReview(
      user?.id as string,
      req.body,
    );

    res.status(201).json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllReviews = async (req: Request, res: Response) => {
  try {
    const result = await ReviewService.getAllReviews();

    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const getTutorReviews = async (req: Request, res: Response) => {
  try {
    const { tutorId } = req.params;

    const result = await ReviewService.getTutorReviews(tutorId as string);

    res.status(20).json({ success: true, data: result });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const getStudentReviews = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    const result = await ReviewService.getStudentReviews(studentId as string);

    res.status(20).json({ success: true, data: result });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const getBookingReview = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;

    const result = await ReviewService.getBookingReview(bookingId as string);

    res.status(20).json({ success: true, data: result });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export const reviewController = {
  createReview,
  getAllReviews,
  getTutorReviews,
  getStudentReviews,
  getBookingReview,
};
