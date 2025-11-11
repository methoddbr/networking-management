import { Request, Response } from "express";
import { prisma } from "../lib/db";

export async function getAllMembers(req: Request, res: Response) {
  try {
    const members = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
    });
    return res.json(members);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
