import { Request, Response } from "express";
import { bookingServices } from "./bookings.service";

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

export const bookingController = {
  createBooking,
};
