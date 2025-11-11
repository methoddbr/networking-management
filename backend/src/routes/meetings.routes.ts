import { Router } from "express";
import {
  createMeeting,
  listMeetings,
  checkin,
  listAttendance,
} from "../controllers/meetings.controller";
import { mockAuthMiddleware, requireRole } from "../middlewares/auth";

const router = Router();

router.get("/", mockAuthMiddleware, listMeetings);

router.post(
  "/",
  mockAuthMiddleware,
  requireRole("admin"),
  createMeeting
);

router.post(
  "/:id/checkin",
  mockAuthMiddleware,
  requireRole("member"),
  checkin
);

router.get(
  "/:id/attendance",
  mockAuthMiddleware,
  requireRole("admin"),
  listAttendance
);

export default router;


