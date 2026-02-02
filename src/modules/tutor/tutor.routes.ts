import express from "express";
import { tutorController } from "./tutor.controller";
import authMiddle, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/create-tutor",
  authMiddle(UserRole.user),
  tutorController.createTutor,
);

export const tutorRoutes = router;
