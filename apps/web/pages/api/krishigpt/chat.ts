import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

export const config = {
  api: { bodyParser: true },
};

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { message, lang = "en" } = req.body as { message: string; lang?: string };

  // Prepare streaming headers
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");

  try {
    // Light system prompt: encourage agriculture focus, but let AI handle filtering
    const systemPrompt = `You are KrishiGPT, a multilingual agriculture advisory assistant. 
- Your focus is agriculture: crops, livestock, fisheries, mushrooms, hydroponics, mandi prices, schemes, weather, warehouses.
- If a question is unrelated, you may politely steer it back to agriculture instead of refusing bluntly.
- Always be clear, concise, and safe. 
- Reply in ${
      lang === "en" ? "English" : lang === "hi" ? "Hindi" : "Marathi"
    }.
- Use relevant emojis like 🌱🐄☁️🐟🍄 where helpful.`;

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
      if (delta) res.write(delta);
    }

    res.end();
  } catch (err) {
    console.error("KrishiGPT stream error:", err);
    res.write("⚠️ Error generating response.");
    res.end();
  }
}
