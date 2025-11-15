import express from "express";
import { authMiddleware } from "../middleware/auth";
import { getProfile, updateProfile, getUserByExperienceId } from "../controllers/user.controller";

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.patch("/profile", authMiddleware, updateProfile);
router.get("/experience/:experienceId", getUserByExperienceId);

export default router;
