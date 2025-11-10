import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(express.json());

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Inicialização
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
