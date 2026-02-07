import express from "express";
import authMiddle, { UserRole } from "../../middlewares/auth";
import { reviewController } from "./reviews.controller";

const router = express.Router();

router.post(
  "/create-review",
  authMiddle(UserRole.student),
  reviewController.createReview,
);

router.get(
  "/all-reviews",
  authMiddle(UserRole.admin),
  reviewController.getAllReviews,
);

router.get("/:tutorId", reviewController.getTutorReviews);
router.get(
  "/:studentId",
  authMiddle(UserRole.student),
  reviewController.getStudentReviews,
);
router.get("/:bookingId", reviewController.getTutorReviews);

export const reviewRoutes = router;
