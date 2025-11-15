import express from "express";
import { authMiddleware } from "../middleware/auth";
import { getProfile, updateProfile } from "../controllers/user.controller";
import { getUserByExperienceId } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.patch("/profile", authMiddleware, updateProfile);
router.get("/experience/:experienceId", getUserByExperienceId);

export default router;
