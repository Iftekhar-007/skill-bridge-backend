import { NextFunction, Request, Response } from "express";
import { tutorService } from "./tutor.service";

const createTutor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(403).json({ success: false, message: "forbidden!" });
    }
    const result = await tutorService.createTutor(req.body, user?.id as string);
    console.log("user id", user?.id);

    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
    next(err);
  }
};

export const tutorController = {
  createTutor,
};
