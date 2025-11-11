import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/db";
import {
  createMemberSchema,
  listMembersQuerySchema,
} from "../schemas/members.schemas";
import { AppError } from "../middlewares/errorHandler";

export async function createMember(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = createMemberSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return next(new AppError(409, "Email already registered"));
    }

    const member = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        phone: data.phone || null,
        company: data.company || null,
        position: data.position || null,
        role: "MEMBER",
        status: "ACTIVE",
        joinedAt: new Date(),
      },
    });

    return res.status(201).json(member);
  } catch (err) {
    next(err);
  }
}

export async function getAllMembers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const q = listMembersQuerySchema.parse(req.query);
    const page = Math.max(1, q.page);
    const limit = Math.min(100, q.limit);

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where: { role: "MEMBER", status: "ACTIVE" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          company: true,
          position: true,
          phone: true,
          joinedAt: true,
        },
        orderBy: { joinedAt: "desc" },
      }),
      prisma.user.count({
        where: { role: "MEMBER", status: "ACTIVE" },
      }),
    ]);

    return res.json({
      items,
      meta: { page, total, limit },
    });
  } catch (err) {
    next(err);
  }
}
