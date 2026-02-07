import express from "express";
import { adminController } from "./admin.controller";
import authMiddle, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.get("/users", authMiddle(UserRole.admin), adminController.getAllUser);

router.get(
  "/users/:userId",
  authMiddle(UserRole.admin),
  adminController.getUserById,
);

router.get(
  "/students",
  authMiddle(UserRole.admin, UserRole.tutor),
  adminController.getStudents,
);

router.patch(
  "/users/status/:userId",
  authMiddle(UserRole.admin),
  adminController.updateUserStatus,
);

router.get("/:studentId", adminController.getStudentById);

export const adminRoutes = router;
