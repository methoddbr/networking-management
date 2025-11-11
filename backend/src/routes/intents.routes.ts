import { Router } from "express";
import {
  createIntent,
  listIntents,
  reviewIntent,
} from "../controllers/intents.controller";

const router = Router();

router.post("/", createIntent);
router.get("/", listIntents);
router.patch("/:id/review", reviewIntent);

export default router;
