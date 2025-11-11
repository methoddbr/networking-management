import { Router } from "express";
import { createIntent } from "../controllers/intents.controller";

const router = Router();

router.post("/", createIntent);

export default router;
