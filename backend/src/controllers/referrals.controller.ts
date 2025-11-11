import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/db";
import {
  createReferralSchema,
  updateReferralSchema,
  thankParamsSchema,
  thankBodySchema,
} from "../schemas/referrals.schemas";
import { AppError } from "../middlewares/errorHandler";

export async function createReferral(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) return next(new AppError(401, "Unauthorized"));

    const data = createReferralSchema.parse(req.body);

    const referral = await prisma.referral.create({
      data: {
        fromMemberId: req.user.id,
        toMemberId: data.toMemberId,
        clientName: data.clientName,
        description: data.description,
        valueEstimated: data.valueEstimated,
        status: "OPEN",
      },
    });

    return res.status(201).json(referral);
  } catch (err) {
    next(err);
  }
}

export async function updateReferral(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params as { id: string };
    const body = updateReferralSchema.parse(req.body);

    const referral = await prisma.referral.findUnique({ where: { id } });
    if (!referral) return next(new AppError(404, "Referral not found"));

    const updated = await prisma.referral.update({
      where: { id },
      data: {
        status: body.status
          .toUpperCase()
          .replace("IN_PROGRESS", "IN_PROGRESS") as any,
        description: body.description ?? referral.description,
        valueEstimated:
          body.valueEstimated ?? referral.valueEstimated ?? undefined,
      },
    });

    return res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function thankReferral(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) return next(new AppError(401, "Unauthorized"));

    const { id } = thankParamsSchema.parse(req.params);
    const body = thankBodySchema.parse(req.body);

    const referral = await prisma.referral.findUnique({ where: { id } });
    if (!referral) return next(new AppError(404, "Referral not found"));

    const existing = await prisma.thank.findUnique({
      where: { referralId: id },
    });
    if (existing) return next(new AppError(409, "Thank already exists"));

    const thank = await prisma.thank.create({
      data: {
        referralId: id,
        fromMemberId: req.user.id,
        message: body.message,
      },
    });

    await prisma.referral.update({
      where: { id },
      data: { thanksPublic: true },
    });

    return res.status(201).json(thank);
  } catch (err) {
    next(err);
  }
}


