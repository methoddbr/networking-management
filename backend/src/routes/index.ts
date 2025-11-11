import { Router } from "express";
import intentsRoutes from "./intents.routes";
import membersRoutes from "./members.routes";
import meetingsRoutes from "./meetings.routes";
import referralsRoutes from "./referrals.routes";

const router = Router();

// Monta as rotas de cada módulo
router.use("/intents", intentsRoutes);
router.use("/members", membersRoutes);
router.use("/meetings", meetingsRoutes);
router.use("/referrals", referralsRoutes);

export default router;
