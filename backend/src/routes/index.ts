import { Router } from "express";
import intentsRoutes from "./intents.routes";
import membersRoutes from "./members.routes";

const router = Router();

// Monta as rotas de cada módulo
router.use("/intents", intentsRoutes);
router.use("/members", membersRoutes);

export default router;
