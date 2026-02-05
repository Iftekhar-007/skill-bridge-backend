import { Request, Response } from "express";
import { adminServices } from "./admin.service";
import { UserRole } from "../../middlewares/auth";

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

const getStudents = async (req: Request, res: Response) => {
  try {
    const data = await adminServices.getStudents();

    res.status(200).json({ success: true, data: data });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const getStudentById = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    const user = req.user;

    const data = await adminServices.getStudentById(studentId as string, {
      id: user?.id as string,
      role: user?.role as UserRole,
    });
    res.status(200).json({ success: true, data: data });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export const adminController = {
  getAllUser,
  getUserById,
  getStudents,
  getStudentById,
};
