import express from "express";
import { studentController } from "./student.controller";
import authMiddle, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.get(
  "/all-students",
  authMiddle(UserRole.admin),
  studentController.getAllStudent,
);

router.post(
  "/create-student",
  authMiddle(UserRole.tutor),
  studentController.createStudentProfile,
);

export const studentRoutes = router;
