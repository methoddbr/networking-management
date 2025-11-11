import { Router } from "express";
import {
  createReferral,
  updateReferral,
  thankReferral,
} from "../controllers/referrals.controller";
import { mockAuthMiddleware, requireRole } from "../middlewares/auth";

const router = Router();

router.post(
  "/",
  mockAuthMiddleware,
  requireRole("member"),
  createReferral
);

router.patch(
  "/:id",
  mockAuthMiddleware,
  updateReferral
);

router.post(
  "/:id/thank",
  mockAuthMiddleware,
  requireRole("member"),
  thankReferral
);

export default router;

