import express, { Application } from "express";
import routes from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

const app: Application = express();

// Middlewares
app.use(express.json());

// Routes (centralizado)
app.use("/api", routes);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

app.use((_req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.use(errorHandler);

export default app;

