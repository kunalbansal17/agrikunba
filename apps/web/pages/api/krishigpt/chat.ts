import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { default: OpenAI } = await import("openai"); // dynamic import (ESM safe)
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: "Say hello in one line." }],
  });

  res.status(200).json({ reply: completion.choices[0].message?.content });
}
