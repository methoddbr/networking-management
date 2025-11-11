import { Router } from "express";
import membersRoutes from "./members.routes";
// import meetingsRoutes from "./meetings.routes";
// import referralsRoutes from "./referrals.routes";

const router = Router();

router.use("/members", membersRoutes);
// router.use("/meetings", meetingsRoutes);
// router.use("/referrals", referralsRoutes);

export default router;
