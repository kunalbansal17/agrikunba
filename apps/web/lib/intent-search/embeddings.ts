import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_SEARCH_API_KEY });

export async function embedText(text: string): Promise<number[]> {
  const resp = await client.embeddings.create({
    model: "text-embedding-3-small", // multilingual support
    input: text,
  });
  return resp.data[0].embedding;
}

export async function translateQueryIfNeeded(q: string): Promise<string> {
  try {
    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Translate this query to English product search terms only." },
        { role: "user", content: q },
      ],
    });
    return resp.choices[0]?.message?.content?.trim() || q;
  } catch (e) {
    console.error("Translation error", e);
    return q;
  }
}