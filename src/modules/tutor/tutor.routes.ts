import express from "express";
import { tutorController } from "./tutor.controller";
import authMiddle, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.get("/tutors", tutorController.getAllTutor);

router.post(
  "/create-tutor",
  authMiddle(UserRole.tutor),
  tutorController.createTutor,
);

router.get("/:tutorId", tutorController.getTutorById);

export const tutorRoutes = router;
