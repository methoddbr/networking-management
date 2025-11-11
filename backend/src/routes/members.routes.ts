import { Router } from "express";
import { getAllMembers } from "../controllers/members.controller";

const router = Router();

router.get("/", getAllMembers);

export default router;
