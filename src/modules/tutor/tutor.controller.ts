import { NextFunction, Request, Response } from "express";
import { tutorService } from "./tutor.service";

const createTutor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(403).json({ success: false, message: "forbidden!" });
    }
    const result = await tutorService.createTutor(user?.id as string, req.body);

    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
    next(err);
  }
};

const getAllTutor = async (req: Request, res: Response) => {
  try {
    const data = await tutorService.getAllTutor();
    res.status(200).json({ success: true, data: data });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const getTutorById = async (req: Request, res: Response) => {
  try {
    const { tutorId } = req.params;
    const result = await tutorService.getTutorById(tutorId as string);

    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export const tutorController = {
  createTutor,
  getAllTutor,
  getTutorById,
};
