import { Request, Response } from "express";
import { studentService } from "./student.service";

const createStudentProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const result = await studentService.createStudentProfile(
      userId as string,
      req.body,
    );

    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    res.status(401).json({ success: false, message: err.message });
  }
};

const getAllStudent = async (req: Request, res: Response) => {
  try {
    const result = await studentService.getAllStudent();

    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export const studentController = {
  getAllStudent,
  createStudentProfile,
};
