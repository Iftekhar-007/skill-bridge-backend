import { Request, Response } from "express";
import { adminServices } from "./admin.service";

const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await adminServices.getAllUser();

    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const result = await adminServices.getUserById(userId as string);

    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export const adminController = {
  getAllUser,
  getUserById,
};
