import { Request, Response } from "express";
import { categoryServices } from "./category.service";
import { UserRole } from "../../middlewares/auth";

const createCategory = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const result = await categoryServices.createCategory(req.body, {
      role: user?.role as UserRole,
    });

    res.status(201).json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllCategory = async (req: Request, res: Response) => {
  try {
    const allCategory = await categoryServices.getAllCategory();
    res.status(201).json({ success: true, data: allCategory });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const categoryController = {
  createCategory,
  getAllCategory,
};
