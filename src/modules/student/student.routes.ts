import express from "express";

import authMiddle, { UserRole } from "../../middlewares/auth";
import { studentController } from "./student.controller";

const router = express.Router();

router.post(
  "/create-student",
  authMiddle(UserRole.student),
  studentController.createStudentProfile,
);

export const studentRoutes = router;
