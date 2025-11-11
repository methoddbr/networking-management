import { Router } from "express";
import {
  createIntent,
  listIntents,
  acceptIntent,
} from "../controllers/intents.controller";

const router = Router();

router.post("/", createIntent);

router.get("/admin", listIntents);
router.post("/admin/:id/accept", acceptIntent);

export default router;
