// apps/web/pages/api/krishigpt/chat.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { getOrSetVisitorId } from "@/lib/visitor";

export const config = { api: { bodyParser: true } };
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { message, lang = "en", chatId: incomingChatId } = req.body as {
    message: string;
    lang?: string;
    chatId?: string;
  };

  // headers for streaming response
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");

  try {
    const visitorId = getOrSetVisitorId(req, res);

    // 1) ensure Chat record exists
    let chatId = incomingChatId;
    if (!chatId) {
      const chat = await prisma.chat.create({
        data: { visitorId, lang },
        select: { id: true },
      });
      chatId = chat.id;
    }

    // 2) save USER message
    await prisma.message.create({
      data: { chatId, role: "user", content: message, model: "user" },
    });

    // 3) system prompt
    const systemPrompt = `You are KrishiGPT, a multilingual agriculture advisory assistant.
- Focus only on agriculture topics: crops, livestock, fisheries, mushrooms, hydroponics, mandi prices, schemes, weather, warehouses.
- If unrelated, gently redirect back to agriculture.
- Be practical, concise, and safe.
- Reply in ${lang === "en" ? "English" : lang === "hi" ? "Hindi" : "Marathi"}.
- Use emojis like 🌾🐄🌦️🐟 where helpful.`;

    // 4) stream assistant reply
    let assistantText = "";
    const stream = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 700,
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content || "";
      if (delta) {
        assistantText += delta;
        res.write(delta);
      }
    }

    // 5) save ASSISTANT message
    if (assistantText.trim()) {
      await prisma.message.create({
        data: { chatId, role: "assistant", content: assistantText, model: "gpt-4o-mini" },
      });
    }

    res.end();
  } catch (err) {
    console.error("KrishiGPT stream error:", err);
    res.write("⚠️ Error generating response.");
    res.end();
  }
}
