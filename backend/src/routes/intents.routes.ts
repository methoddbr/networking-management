import { Router } from "express";
import {
  createIntent,
  listIntents,
  acceptIntent,
} from "../controllers/intents.controller";
import { mockAuthMiddleware, requireRole } from "../middlewares/auth";

const router = Router();

router.post("/", createIntent);

router.get("/admin", mockAuthMiddleware, requireRole("admin"), listIntents);

router.post(
  "/admin/:id/accept",
  mockAuthMiddleware,
  requireRole("admin"),
  acceptIntent
);

router.post(
  "/admin/:id/reject",
  mockAuthMiddleware,
  requireRole("admin"),
  acceptIntent
);

export default router;
