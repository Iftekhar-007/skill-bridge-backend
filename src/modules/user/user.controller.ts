import { Request, Response } from "express";
import { userServices } from "./user.service";

const getAllUser = async (req: Request, res: Response) => {
  try {
    const data = await userServices.getAllUser();
    res.status(200).json({ success: true, data: data });
  } catch (err) {
    res.status(404).json({ success: false, message: "something went wrong" });
  }
};

export const userController = {
  getAllUser,
};
