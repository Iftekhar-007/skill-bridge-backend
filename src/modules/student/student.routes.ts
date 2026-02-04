import express from "express";

import authMiddle, { UserRole } from "../../middlewares/auth";
import { studentController } from "./student.controller";

const router = express.Router();

router.get(
  "/students",
  authMiddle(UserRole.admin),
  studentController.getAllStudent,
);

router.post(
  "/create-student",
  authMiddle(UserRole.student),
  studentController.createStudentProfile,
);

export const studentRoutes = router;
