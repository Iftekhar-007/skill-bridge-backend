import { NextFunction, Request, Response } from "express";
import { bookingService } from "./bookings.service";

const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;

    const result = await bookingService.createBooking(
      req.body,
      userId as string,
    );

    res.status(201).json({ success: true, data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const bookingController = {
  createBooking,
};
