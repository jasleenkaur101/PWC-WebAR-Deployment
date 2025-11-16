import express from "express";
import { getProfile, updateProfile, getUserByExperienceId } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.patch("/profile", authMiddleware, updateProfile);
router.get("/experience/:experienceId", getUserByExperienceId); 

// Admin routes (protected by auth)
router.get("/admin/all", authMiddleware, async (req, res) => {
  try {
    const { prisma } = await import("../prisma");
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        experienceId: true,
        convaiId: true,
        rpmAvatarUrl: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.delete("/admin/:userId", authMiddleware, async (req, res) => {
  try {
    const { prisma } = await import("../prisma");
    const userId = parseInt(req.params.userId);
    await prisma.user.delete({ where: { id: userId } });
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;