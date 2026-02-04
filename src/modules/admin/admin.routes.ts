import express from "express";
import { adminController } from "./admin.controller";
import authMiddle, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.get("/users", authMiddle(UserRole.admin), adminController.getAllUser);

router.get("/:userId", authMiddle(UserRole.admin), adminController.getUserById);

export const adminRoutes = router;
