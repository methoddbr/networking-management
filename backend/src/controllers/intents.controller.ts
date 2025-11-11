import { Request, Response } from "express";
import { prisma } from "../lib/db";
import { IntentStatus } from "@prisma/client";

export const createIntent = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message, source } = req.body;

    const intent = await prisma.intent.create({
      data: { name, email, phone, message, source },
    });

    return res.status(201).json(intent);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create intent" });
  }
};

export const listIntents = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    const where =
      status && typeof status === "string" && status in IntentStatus
        ? { status: status as IntentStatus }
        : {};

    const intents = await prisma.intent.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return res.json(intents);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch intents" });
  }
};

export const reviewIntent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Missing intent ID" });
    }

    if (!Object.values(IntentStatus).includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const intent = await prisma.intent.update({
      where: { id: String(id) },
      data: { status },
    });

    return res.json(intent);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update intent" });
  }
};
