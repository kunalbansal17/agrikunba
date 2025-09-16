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
   const lower = message.toLowerCase();


   // 🔒 Guardrail 1: Non-agriculture queries
   if (
     !(
       lower.includes("crop") ||
       lower.includes("farm") ||
       lower.includes("cattle") ||
       lower.includes("cow") ||
       lower.includes("goat") ||
       lower.includes("buffalo") ||
       lower.includes("fish") ||
       lower.includes("poultry") ||
       lower.includes("mushroom") ||
       lower.includes("hydro") ||
       lower.includes("mandi") ||
       lower.includes("scheme") ||
       lower.includes("pm-kisan") ||
       lower.includes("weather") ||
       lower.includes("warehouse")
     )
   ) {
     res.write("🌱 I can only answer agriculture-related queries. Please ask about crops, livestock, fisheries, weather, mandi prices, or schemes.");
     return res.end();
   }


   // 🔒 Guardrail 2: Unsafe chemical use
   if (
     lower.includes("overdose") ||
     lower.includes("double dose") ||
     lower.includes("extra strong") ||
     lower.includes("maximum fertilizer")
   ) {
     res.write("⚠️ Always follow the label instructions when using agrochemicals. For dosage confirmation, please consult your local KVK or agriculture officer.");
     return res.end();
   }


   // 🔑 System prompt with multilingual handling
   const systemPrompt = `You are KrishiGPT, an agricultural advisory assistant.
- Only answer agriculture-related queries (crops, pests, livestock, fisheries, mushrooms, hydroponics, govt schemes, warehouses, mandi prices, weather).
- Be practical, concise, step-wise, and safe.
- If unrelated, politely refuse.
- For pesticide/fertilizer doses: remind to follow label & local experts.
- Always reply in ${
     lang === "en" ? "English" : lang === "hi" ? "Hindi" : "Marathi"
   }.
- Add relevant emojis like 🌱🐄☁️🐟🍄 to make answers engaging for farmers.`;


   // 🔄 Stream tokens from OpenAI
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


