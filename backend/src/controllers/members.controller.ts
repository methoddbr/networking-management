import { Request, Response } from "express";
import { prisma } from "../lib/db";
import bcrypt from "bcrypt";

export const createMember = async (req: Request, res: Response) => {
  try {
    const { email, password, name, company, position, phone } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const passwordHash = password ? await bcrypt.hash(password, 10) : null;

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        company,
        position,
        phone,
        role: "MEMBER",
        status: "PENDING",
      },
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create member" });
  }
};

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
