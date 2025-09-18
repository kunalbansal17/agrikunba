// /apps/web/lib/weather.ts
export type GeoHit = {
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
  pincode?: string;
  provider?: string;
};

export type WeatherSnapshot = {
  place: string;
  lat: number;
  lon: number;
  now?: { tempC?: number; windKmh?: number; weathercode?: number };
  today: {
    precipProbMax?: number;
    precipSumMm?: number;
    windMaxKmh?: number;
    tMinC?: number;
    tMaxC?: number;
  };
  next48h: Array<{
    iso: string;
    precipProb?: number;
    precipMm?: number;
    windKmh?: number;
    rh?: number;
  }>;
};

const OME_GEO = "https://geocoding-api.open-meteo.com/v1/search";
const OME_FC = "https://api.open-meteo.com/v1/forecast";

// --- NEW: Google Geocoding wrapper ---
async function geocodeGoogle(query: string): Promise<GeoHit | null> {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      query
    )}&key=${process.env.GOOGLE_MAPS_KEY}`;
    const r = await fetch(url);
    if (!r.ok) return null;
    const j = await r.json();
    if (!j.results || j.results.length === 0) return null;

    const best = j.results[0];
    const loc = best.geometry.location;

    let pincode: string | undefined;
    const comp = best.address_components.find((c: any) =>
      c.types.includes("postal_code")
    );
    if (comp) pincode = comp.long_name;

    return {
      name: best.formatted_address,
      admin1: "",
      country: "",
      latitude: loc.lat,
      longitude: loc.lng,
      pincode,
      provider: "google",
    };
  } catch (err) {
    console.error("Google geocode error:", err);
    return null;
  }
}

// --- MAIN: Combined geocodeLocation ---
export async function geocodeLocation(
  q: string,
  lang = "en"
): Promise<GeoHit | null> {
  if (!q) return null;

  // 1. Try Google
  const g = await geocodeGoogle(q);
  if (g) return g;

  // 2. Fallback to Open-Meteo
  const url = new URL(OME_GEO);
  url.searchParams.set("name", q);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", lang);
  url.searchParams.set("country", "IN");
  const r = await fetch(url.toString(), { cache: "no-store" });
  if (!r.ok) return null;
  const j = await r.json();
  let hit = j?.results?.[0];
  if (!hit && /[,.-]/.test(q)) {
    const last = q
      .split(/[,-.]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .pop();
    if (last && last.toLowerCase() !== q.toLowerCase()) {
      return geocodeLocation(last, lang);
    }
  }
  if (!hit) return null;

  return {
    name: hit.name,
    admin1: hit.admin1,
    country: hit.country,
    latitude: hit.latitude,
    longitude: hit.longitude,
    provider: "open-meteo",
  };
}

// (rest of your file stays SAME: fetchForecast, goNoGo, summarizeWeather)

export async function fetchForecast(lat: number, lon: number): Promise<WeatherSnapshot | null> {
  const url = new URL(OME_FC);
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("current_weather", "true");
  url.searchParams.set("hourly", [
    "precipitation_probability",
    "precipitation",
    "wind_speed_10m",
    "relative_humidity_2m",
  ].join(","));
  url.searchParams.set("daily", [
    "precipitation_probability_max",
    "precipitation_sum",
    "wind_speed_10m_max",
    "temperature_2m_max",
    "temperature_2m_min",
  ].join(","));
  url.searchParams.set("windspeed_unit", "kmh");
  url.searchParams.set("precipitation_unit", "mm");

  const r = await fetch(url.toString(), { cache: "no-store" });
  if (!r.ok) return null;
  const j = await r.json();

  const snap: WeatherSnapshot = {
    place: "",
    lat,
    lon,
    now: j.current_weather
      ? {
          tempC: j.current_weather.temperature,
          windKmh: j.current_weather.windspeed,
          weathercode: j.current_weather.weathercode,
        }
      : undefined,
    today: {
      precipProbMax: j?.daily?.precipitation_probability_max?.[0],
      precipSumMm: j?.daily?.precipitation_sum?.[0],
      windMaxKmh: j?.daily?.wind_speed_10m_max?.[0],
      tMinC: j?.daily?.temperature_2m_min?.[0],
      tMaxC: j?.daily?.temperature_2m_max?.[0],
    },
    next48h: [],
  };

  const hours = j?.hourly?.time ?? [];
  const pp = j?.hourly?.precipitation_probability ?? [];
  const p = j?.hourly?.precipitation ?? [];
  const w = j?.hourly?.wind_speed_10m ?? [];
  const rh = j?.hourly?.relative_humidity_2m ?? [];
  for (let i = 0; i < Math.min(hours.length, 48); i++) {
    snap.next48h.push({
      iso: hours[i],
      precipProb: pp?.[i],
      precipMm: p?.[i],
      windKmh: w?.[i],
      rh: rh?.[i],
    });
  }
  return snap;
}

export type Activity = "spray" | "irrigate";

export function goNoGo(s: WeatherSnapshot, activity: Activity) {
  const window6h = s.next48h.slice(0, 6);
  const window12h = s.next48h.slice(0, 12);
  const window24h = s.next48h.slice(0, 24);

  const maxProb6 = Math.max(...window6h.map(h => h.precipProb ?? 0));
  const maxWind6 = Math.max(...window6h.map(h => h.windKmh ?? 0));
  const sumRain6 = window6h.reduce((a, h) => a + (h.precipMm ?? 0), 0);
  const maxProb24 = Math.max(...window24h.map(h => h.precipProb ?? 0));
  const sumRain24 = window24h.reduce((a, h) => a + (h.precipMm ?? 0), 0);

  if (activity === "spray") {
    if (maxProb6 >= 40 || sumRain6 >= 1 || maxWind6 >= 15) {
      return { decision: "NO_GO" as const, reason: "High rain chance or strong wind in next 6h." };
    }
    const hasGoodWindow = window12h.some(h =>
      (h.precipProb ?? 0) < 30 && (h.windKmh ?? 0) < 12 && (h.rh ?? 60) <= 85
    );
    return { decision: "GO" as const, reason: hasGoodWindow ? "Favorable window in next 12h." : "Conditions acceptable." };
  }

  if (sumRain24 >= 5 || maxProb24 >= 60) {
    return { decision: "NO_GO" as const, reason: "Rain likely; save water & reassess after rainfall." };
  }
  return { decision: "GO" as const, reason: "Low rain risk; irrigation suitable." };
}

export function summarizeWeather(placeLabel: string, s: WeatherSnapshot) {
  const today = s.today;
  const peakProb = Math.max(...s.next48h.map(h => h.precipProb ?? 0));
  const peakWind = Math.max(...s.next48h.map(h => h.windKmh ?? 0));
  return [
    `Weather@${placeLabel} (lat ${s.lat.toFixed(2)}, lon ${s.lon.toFixed(2)})`,
    s.now?.tempC != null ? `Now: ${s.now.tempC}°C, wind ${Math.round(s.now.windKmh ?? 0)} km/h` : "",
    `Today: rain prob max ${today.precipProbMax ?? "-"}%, rain total ${today.precipSumMm ?? "-"} mm, wind max ${today.windMaxKmh ?? "-"} km/h, Tmin/Tmax ${today.tMinC ?? "-"}°/${today.tMaxC ?? "-"}°C`,
    `Next 48h peaks: rain prob ${peakProb}%, wind ${Math.round(peakWind)} km/h`,
  ].filter(Boolean).join(" • ");
}
