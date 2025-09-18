// /apps/web/pages/api/tools/weather.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { fetchForecast, geocodeLocation, summarizeWeather, goNoGo, type Activity } from "@/lib/krishigpt/weather";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { q, lat, lon, lang = "en", activity }: { q?: string; lat?: number; lon?: number; lang?: string; activity?: Activity } = req.body ?? {};

    let _lat = lat, _lon = lon, label = "";
    if ((_lat == null || _lon == null) && q) {
      const hit = await geocodeLocation(q, lang);
      if (!hit) return res.status(404).json({ error: "LOCATION_NOT_FOUND" });
      _lat = hit.latitude; _lon = hit.longitude;
      label = [hit.name, hit.admin1].filter(Boolean).join(", ");
    }
    if (_lat == null || _lon == null) return res.status(400).json({ error: "NO_LOCATION" });

    const fc = await fetchForecast(_lat, _lon);
    if (!fc) return res.status(502).json({ error: "WEATHER_UNAVAILABLE" });

    fc.place = label || "Selected location";
    const summary = summarizeWeather(fc.place, fc);
    const decision = activity ? goNoGo(fc, activity) : null;

    return res.status(200).json({ summary, forecast: fc, decision });
  } catch (e: any) {
    return res.status(500).json({ error: "SERVER_ERROR", detail: String(e?.message ?? e) });
  }
}
