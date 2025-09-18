import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { assistantId } = req.query;
  if (!assistantId || typeof assistantId !== "string") {
    return res.status(400).json({ suggestions: [] });
  }

  const msg = await prisma.message.findFirst({
    where: { model: "suggestions:v1", content: { not: "" } },
    orderBy: { createdAt: "desc" },
  });

  if (!msg) return res.json({ suggestions: [] });

  try {
    const parsed = JSON.parse(msg.content);
    return res.json({ suggestions: parsed.suggestions || [] });
  } catch {
    return res.json({ suggestions: [] });
  }
}
