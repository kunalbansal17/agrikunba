import OpenAI from "openai";

const OPENAI_KEY =
  process.env.OPENAI_SEARCH_API_KEY ||
  process.env.OPENAI_API_SEARCH_KEY || // <- fallback to your older var name
  process.env.OPENAI_API_KEY;          // final fallback if you set a global

if (!OPENAI_KEY) throw new Error("OPENAI_SEARCH_API_KEY / OPENAI_API_SEARCH_KEY missing");

const client = new OpenAI({ apiKey: OPENAI_KEY });

export async function embedText(text: string): Promise<number[]> {
  const r = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return r.data[0].embedding;
}

export async function translateQueryIfNeeded(q: string): Promise<string> {
  // Skip translation if alphanumeric (likely English)
  if (/^[a-z0-9\s]+$/i.test(q)) return q;

  const r = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Translate this user query into English search terms only." },
      { role: "user", content: q },
    ],
  });
  return r.choices[0]?.message?.content?.trim() || q;
}
