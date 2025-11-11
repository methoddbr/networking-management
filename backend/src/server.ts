import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import membersRoutes from "./routes/members.routes";
import intentsRoutes from "./routes/intents.routes";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(express.json());

// Routes
app.use("/api/members", membersRoutes);
app.use("/api/intents", intentsRoutes);

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
