import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).userId as number;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, experienceId: true, convaiId: true, rpmAvatarUrl: true, createdAt: true }
    });
    if (!user) return res.status(404).json({ error: "Not found" });
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load profile" });
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).userId as number;
    const { rpmAvatarUrl, convaiId, name } = req.body as {
      rpmAvatarUrl?: string; convaiId?: string; name?: string;
    };

    // Optional server-side validation for .glb links
    if (rpmAvatarUrl) {
      const ok = /^https?:\/\/.+\.glb(\?.*)?$/i.test(rpmAvatarUrl.trim());
      if (!ok) return res.status(400).json({ error: "Invalid .glb URL" });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(convaiId !== undefined ? { convaiId } : {}),
        ...(rpmAvatarUrl !== undefined ? { rpmAvatarUrl: rpmAvatarUrl.trim() } : {}),
      },
      select: { id: true, email: true, name: true, experienceId: true, convaiId: true, rpmAvatarUrl: true }
    });

    res.json(updated);
  } catch (e:any) {
    console.error(e);
    res.status(500).json({ error: "Failed to update profile" });
  }
}

export async function getUserByExperienceId(req: Request, res: Response) {
  try {
    let { experienceId } = req.params;
    
    if (!experienceId) {
      return res.status(400).json({ error: "Experience ID is required" });
    }

    // Remove "USER" prefix if present (case-insensitive)
    experienceId = experienceId.replace(/^USER/i, '');
    
    console.log('Looking for experienceId:', experienceId);

    const user = await prisma.user.findUnique({
      where: { experienceId },
      select: {
        id: true,
        email: true,
        name: true,
        experienceId: true,
        convaiId: true,
        rpmAvatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      console.log('User not found for experienceId:', experienceId);
      return res.status(404).json({ error: "User not found" });
    }

    console.log('User found:', user);
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load user by experience ID" });
  }
}
