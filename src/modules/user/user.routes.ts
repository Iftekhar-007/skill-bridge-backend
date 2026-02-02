import express from "express";
import { userController } from "./user.controller";

const router = express.Router();

router.get("/tutors", userController.getAllUser);

export const userRoutes = router;
