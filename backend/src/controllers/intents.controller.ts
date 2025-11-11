import { Request, Response } from "express";
import { prisma } from "../lib/db";

export const createIntent = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message, source } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const intent = await prisma.intent.create({
      data: { name, email, phone, message, source },
    });

    return res.status(201).json(intent);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create intent" });
  }
};
