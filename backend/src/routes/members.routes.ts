import { Router } from "express";
import { createMember, getAllMembers } from "../controllers/members.controller";

const router = Router();

router.get("/", getAllMembers);
router.post("/", createMember);

export default router;
