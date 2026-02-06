import express from "express";
import authMiddle, { UserRole } from "../../middlewares/auth";
import { categoryController } from "./category.controller";

const router = express.Router();

router.post(
  "/create-category",
  authMiddle(UserRole.admin),
  categoryController.createCategory,
);

router.get("/all-category", categoryController.getAllCategory);

export const categoryRouter = router;
