import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/db";
import {
  createMeetingSchema,
  checkinSchema,
  listMeetingsQuerySchema,
} from "../schemas/meetings.schemas";
import { AppError } from "../middlewares/errorHandler";

export async function createMeeting(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return next(new AppError(401, "Unauthorized"));
    }

    const data = createMeetingSchema.parse(req.body);

    const meeting = await prisma.meeting.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        date: new Date(data.date),
        location: data.location ?? null,
        createdById: req.user.id,
      },
    });

    return res.status(201).json(meeting);
  } catch (err) {
    next(err);
  }
}

export async function listMeetings(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const q = listMeetingsQuerySchema.parse(req.query);
    const page = Math.max(1, q.page);
    const limit = Math.min(100, q.limit);

    const [items, total] = await Promise.all([
      prisma.meeting.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: "desc" },
      }),
      prisma.meeting.count(),
    ]);

    return res.json({ items, meta: { page, total, limit } });
  } catch (err) {
    next(err);
  }
}

export async function checkin(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return next(new AppError(401, "Unauthorized"));
    }

    const { id } = req.params;
    if (!id) {
      return next(new AppError(400, "Missing meeting id"));
    }
    const body = checkinSchema.parse(req.body ?? {});

    const meeting = await prisma.meeting.findUnique({ where: { id } });
    if (!meeting) {
      return next(new AppError(404, "Meeting not found"));
    }

    const attendance = await prisma.attendance.upsert({
      where: {
        meetingId_userId: { meetingId: id, userId: req.user.id },
      },
      update: {
        status:
          body.status === "present"
            ? "PRESENT"
            : body.status === "absent"
            ? "ABSENT"
            : "LATE",
        checkedAt: new Date(),
      },
      create: {
        meetingId: id,
        userId: req.user.id,
        status:
          body.status === "present"
            ? "PRESENT"
            : body.status === "absent"
            ? "ABSENT"
            : "LATE",
      },
    });

    return res.json(attendance);
  } catch (err) {
    next(err);
  }
}

export async function listAttendance(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    if (!id) {
      return next(new AppError(400, "Missing meeting id"));
    }

    const meeting = await prisma.meeting.findUnique({ where: { id } });
    if (!meeting) {
      return next(new AppError(404, "Meeting not found"));
    }

    const items = await prisma.attendance.findMany({
      where: { meetingId: id },
      orderBy: { checkedAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return res.json(items);
  } catch (err) {
    next(err);
  }
}
