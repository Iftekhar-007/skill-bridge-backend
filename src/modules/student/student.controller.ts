import { Request, Response } from "express";
import { studentService } from "./student.service";

const createStudentProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const data = await studentService.createStudentProfile(
      req.body,
      user?.id as string,
    );

    res.status(200).json({ success: true, data: data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const studentController = {
  createStudentProfile,
};
