import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import {
  geocodeLocation,
  fetchForecast,
  summarizeWeather,
  goNoGo,
} from "@/lib/krishigpt/weather";

export const config = { api: { bodyParser: { sizeLimit: "1mb" } } };

//logging time
const t0 = Date.now();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

/** 🔧 KrishiGPT system prompt */
const BASE_PROMPT = `
You are 🌱 KrishiGPT — India’s Agriculture Guide.
- Speak in the user's chosen language, be concise, friendly, and use a few helpful emojis.
- Answer strictly in user's chosen language. Do not switch languages unless explicitly asked.
- Focus on crops, livestock, mandi prices, weather, warehouses, and government schemes.
- When asked for actionable advice, be practical and safe; cite assumptions or data snapshots if provided.
- If a topic is outside agriculture, gently steer the user back with a relevant suggestion.
- Consider all queries agriculture-related unless explicitly personal.
`;

type Body = {
  chatId?: string;
  message: string;
  lang?: string;
  visitorId?: string | null;
  loc?: { lat: number; lon: number } | null;
  temperature?: number;
  max_tokens?: number;
};

// ———————————————————————————————————————————————————————————————
// Helpers
// ———————————————————————————————————————————————————————————————

function extractPincode(s: string): string | null {
  const m = s.match(/\b[1-9]\d{5}\b/);
  return m ? m[0] : null;
}

function ensureVisitorId(req: NextApiRequest, res: NextApiResponse, incoming?: string | null) {
  let vid = (incoming ?? "").trim() || req.cookies?.["agk_vid"] || "";
  if (!vid) vid = `v_${randomUUID()}`;
  if (req.cookies?.["agk_vid"] !== vid) {
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    res.setHeader(
      "Set-Cookie",
      `agk_vid=${vid}; Path=/; HttpOnly; SameSite=Lax; Expires=${expires.toUTCString()}`
    );
  }
  return vid;
}

// ———————————————————————————————————————————————————————————————
// Route
// ———————————————————————————————————————————————————————————————

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const {
    chatId: incomingChatId,
    message,
    lang = "en",
    visitorId,
    loc,
    temperature = 0.6,
    max_tokens = 512,
  }: Body = (req.body ?? {}) as Body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "NO_MESSAGE" });
  }

  try {
    // 1) Ensure visitorId and Chat row
    const vid = ensureVisitorId(req, res, visitorId ?? null);

    let chat =
      incomingChatId
        ? await prisma.chat.findUnique({ where: { id: incomingChatId } })
        : null;

    if (!chat) {
      chat = await prisma.chat.create({
        data: { visitorId: vid, lang },
      });
    }

    // 2) Pre-create assistant row (needed for streaming)
    const [userRow, assistantRow] = await prisma.$transaction([
      prisma.message.create({
        data: {
          chatId: chat.id,
          role: "USER" as any,
          content: message,
          model: "user",
        },
      }),
      prisma.message.create({
        data: {
          chatId: chat.id,
          role: "ASSISTANT" as any,
          content: "",
          model: "gpt-4o-mini",
        },
        select: { id: true },
      }),
    ]);

    console.log("Intent detection:", Date.now() - t0, "ms");

    // 3) Detect weather intent
    const detect = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.0,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "WeatherIntent",
          schema: {
            type: "object",
            properties: {
              need_weather: { type: "boolean" },
              place_text: { type: "string" },
              activity: { type: "string", enum: ["none", "spray", "irrigate"] },
              timeframe: { type: "string", enum: ["today", "tomorrow", "next_48h", "none"] },
              confidence: { type: "number", minimum: 0, maximum: 1 }
            },
            required: ["need_weather"],
            additionalProperties: false,
          },
        },
      },
      messages: [
        {
          role: "system",
          content:
            "Infer if answering requires weather. Handle any language. Extract timeframe (today/tomorrow/next_48h).",
        },
        { role: "user", content: message },
      ],
    });

    let wantWeather = false;
    let placeText = "";
    let timeframe: "today" | "tomorrow" | "next_48h" | "none" = "none";
    let activity: "none" | "spray" | "irrigate" = "none";

    try {
      const payload = JSON.parse(detect.choices[0]?.message?.content ?? "{}");
      wantWeather = Boolean(payload?.need_weather);
      placeText = (payload?.place_text ?? "").trim();
      timeframe = payload?.timeframe || "none";
      activity =
        payload?.activity === "spray" || payload?.activity === "irrigate"
          ? payload.activity
          : "none";
      if (typeof payload?.confidence === "number" && payload.confidence < 0.45) {
        wantWeather = false;
      }
    } catch {
      wantWeather = false;
    }

    // 4) LOCATION — reuse last if none new
    const pinFromText = extractPincode(message);
    let lat = loc?.lat;
    let lon = loc?.lon;
    let label = loc ? "your location" : "";

    if ((lat == null || lon == null) && placeText) {
      const hit = await geocodeLocation(placeText, lang);
      if (hit) {
        lat = hit.latitude;
        lon = hit.longitude;
        label = [hit.name, hit.admin1].filter(Boolean).join(", ");
      }
    } else if (lat == null || lon == null) {
      const lastLoc = await prisma.message.findFirst({
        where: { chatId: chat.id, model: "ctx:location" },
        orderBy: { createdAt: "desc" },
      });
      if (lastLoc) {
        const parsed = JSON.parse(lastLoc.content);
        lat = parsed.lat;
        lon = parsed.lon;
        label = parsed.label;
      }
    }

    // 5) WEATHER snapshot (non-blocking save later)
    let weatherSystem = "";
    let weatherPayload: any = null;

    if (wantWeather && lat != null && lon != null) {
      const fc = await fetchForecast(lat, lon);
      if (fc) {
        fc.place = label || "Selected location";
        let summary = summarizeWeather(fc.place, fc);
        if (timeframe === "today") {
          summary = `🌤️ Today in ${fc.place}: rain chance ${fc.today.precipProbMax}%, total ${fc.today.precipSumMm}mm.`;
        } else if (timeframe === "tomorrow") {
          summary = `🌧️ Tomorrow in ${fc.place}: rain chance ${fc.today.precipProbMax}%, total ${fc.today.precipSumMm}mm.`;
        }
        const decision = activity !== "none" ? goNoGo(fc, activity) : null;

        weatherSystem =
          `[WEATHER]\n${summary}\n` +
          (decision ? `Decision for ${activity}: ${decision.decision} — ${decision.reason}\n` : ``);

        weatherPayload = {
          label: fc.place,
          summary,
          activity,
          decision,
          ts: new Date().toISOString(),
        };
      }
    }

    console.log("Weather lookup:", Date.now() - t0, "ms");

    // 6) Final system prompt
    const systemPrompt = `${BASE_PROMPT}\n${weatherSystem}\nKeep output clean.`;

    // 7) Stream to client immediately
    res.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-store",
      "X-Chat-Id": chat.id,
      "X-Assistant-Id": assistantRow.id,
      "X-Visitor-Id": vid,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      temperature,
      max_tokens,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    let full = "";
    for await (const part of completion) {
      const delta = part.choices?.[0]?.delta?.content ?? "";
      if (delta) {
        full += delta;
        res.write(delta);
      }
    }
    res.end();

    console.log("Started streaming at:", Date.now() - t0, "ms");

    // 8) Persist context/weather/suggestions async (fire-and-forget)
    setImmediate(async () => {
      try {
        await prisma.$transaction([
          prisma.message.update({
            where: { id: assistantRow.id },
            data: { content: full },
          }),
          ...(weatherPayload
            ? [
                prisma.message.create({
                  data: {
                    chatId: chat.id,
                    role: "SYSTEM",
                    model: "ctx:weather",
                    content: JSON.stringify(weatherPayload),
                  },
                }),
              ]
            : []),
        ]);

        // Suggestions async
        const suggRes = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          temperature: 0.2,
          max_tokens: 120,
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "Suggestions",
              schema: {
                type: "object",
                properties: {
                  suggestions: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 3,
                    maxItems: 3,
                  },
                },
                required: ["suggestions"],
                additionalProperties: false,
              },
            },
          },
          messages: [
            {
              role: "system",
              content:
                "Generate 3 short follow-up questions in the same language. Under 12 words. Use real scheme/crop/place names when possible.",
            },
            { role: "user", content: `Language: ${lang}\nUser asked: ${message}\nAssistant replied: ${full}` },
          ],
        });
        const payload = JSON.parse(suggRes.choices[0]?.message?.content ?? "{}");
        const suggestions: string[] = Array.isArray(payload?.suggestions) ? payload.suggestions : [];
        if (suggestions.length === 3) {
          await prisma.message.create({
            data: {
              chatId: chat.id,
              role: "SYSTEM",
              model: "suggestions:v1",
              content: JSON.stringify({
                parentAssistantId: assistantRow.id,
                suggestions,
                ts: new Date().toISOString(),
              }),
            },
          });
        }
      } catch (err) {
        console.error("Background persistence failed:", err);
      }
    });

    console.log("Total:", Date.now() - t0, "ms");
  } catch (err: any) {
    try {
      res.write(`\n\nSorry, I hit an error. ${String(err?.message ?? err)} 😔`);
      res.end();
    } catch {}
  }
}
