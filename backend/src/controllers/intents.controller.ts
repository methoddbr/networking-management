import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/db";
import {
  createIntentSchema,
  adminListQuerySchema,
  acceptIntentParamsSchema,
} from "../schemas/intents.schemas";

export async function createIntent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = createIntentSchema.parse(req.body);

    const intent = await prisma.intent.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        message: data.message || "",
        source: data.source || null,
        status: "NEW",
      },
    });

    return res.status(201).json(intent);
  } catch (err) {
    // Zod errors will fall here; next(err) permite middleware de erro lidar
    next(err);
  }
}

export async function listIntents(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const q = adminListQuerySchema.parse(req.query);
    const page = Math.max(1, q.page);
    const limit = Math.min(100, q.limit);
    const where: any = {};

    if (q.status) where.status = q.status;

    const [items, total] = await Promise.all([
      prisma.intent.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.intent.count({ where }),
    ]);

    return res.json({
      items,
      meta: { page, total, limit },
    });
  } catch (err) {
    next(err);
  }
}

export async function acceptIntent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = acceptIntentParamsSchema.parse(req.params);

    const intent = await prisma.intent.findUnique({ where: { id } });
    if (!intent) return res.status(404).json({ error: "Intent not found" });

    const updatedIntent = await prisma.intent.update({
      where: { id },
      data: { status: "ACCEPTED" },
    });

    const user = await prisma.user.create({
      data: {
        email: intent.email,
        name: intent.name,
        role: "MEMBER",
        status: "PENDING",
        joinedAt: new Date(),
      },
    });

    return res.json({ intent: updatedIntent, user });
  } catch (err) {
    next(err);
  }
}
