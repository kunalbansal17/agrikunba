"use client";

import React, { useEffect, useRef, useState } from "react";


// Languages
const LANGS = [
  { key: "en", label: "English" },
  { key: "hi", label: "हिंदी" },
  { key: "mr", label: "मराठी" },
  { key: "gu", label: "ગુજરાતી" },
  { key: "bn", label: "বাংলা" },
  { key: "ta", label: "தமிழ்" },
  { key: "te", label: "తెలుగు" },
] as const;

type LangKey = (typeof LANGS)[number]["key"];

// Scenario keys that we can switch between
const SCENARIO_KEYS = [
  "weather",
  "nutrition",
  "prices",
  "pest",
  "cattle",
  "fisheries",
  "mushroom",
  "hydro",
  "schemes",
  "warehouse",
  // style demo
  "style_now",
  "style_why",
  "style_next",
  "style_safety",
] as const;

type ScenarioKey = (typeof SCENARIO_KEYS)[number];

// Script: per language, per scenario → Q&A (multi‑line answers)
const SCRIPTS: Record<LangKey, Record<ScenarioKey, { q: string; a: string }>> = {
  en: {
    weather: {
      q: "Will it rain tomorrow morning in Nandurbar for my cotton spray?",
      a: `Rain chance stays high until ~10am with moderate wind.
Wait for a dry leaf surface; avoid spraying on wet foliage.
Safer spray window looks like early tomorrow 6–8am.
Use a sticker only if the label explicitly allows it.
Recheck weather just before mixing. (Demo)`,
    },
    nutrition: {
      q: "Urea for 1 acre maize at 25 DAS — how much now?",
      a: `Use a split dose rather than all at once.
Typical range is X–Y kg urea/acre (confirm with soil test).
Apply half now; balance after 7 days with light irrigation.
Keep soil moist; avoid waterlogging after top‑dress.
If yellowing continues, check micronutrients. (Demo)`,
    },
    prices: {
      q: "Today’s mandi price for coriander in Kota and last 7‑day trend?",
      a: `Today’s spot is around the mid‑band for this market.
Last 7 days show a mild up‑trend with some volatility.
If selling, plan route early to avoid late arrivals.
Grade and moisture affect the realized price.
Save this mandi to receive daily pings. (Demo)`,
    },
    pest: {
      q: "Fall armyworm in maize — what should I do first?",
      a: `Start with IPM basics: scout early; hand‑remove where feasible.
Maintain clean borders; avoid heavy N flushes.
If threshold crosses, use only label‑listed actives/doses.
Rotate modes of action; keep a PHI diary.
Do not spray in high wind or rain risk. (Demo)`,
    },
    cattle: {
      q: "Cow eating less due to heat — quick help?",
      a: `Provide shade and cool, clean water throughout the day.
Feed during cooler hours; add electrolytes as advised by vet.
Improve airflow; use fans/foggers if available.
Avoid heavy feed during peak heat; watch dehydration.
Call your vet if appetite stays low. (Demo)`,
    },
    fisheries: {
      q: "Tilapia pond oxygen is low at night — what to change?",
      a: `Run aerators in late evening and early morning.
Reduce feeding temporarily; avoid over‑stocking.
Check dissolved oxygen and pH before first feed.
Consider liming if alkalinity/pH are low.
Keep gear sanitized to cut disease. (Demo)`,
    },
    mushroom: {
      q: "Button mushrooms are browning — how to fix fast?",
      a: `Lower room temperature slightly; raise RH to ~85–90%.
Improve fresh‑air exchange without drying beds.
Maintain strict hygiene; avoid touching caps.
Remove heavily affected trays to limit spread.
Review pasteurization logs for next cycle. (Demo)`,
    },
    hydro: {
      q: "Hydroponic lettuce EC is 2.6 — quick correction?",
      a: `Flush the system with plain water to ~1.2–1.6 EC.
Re‑dose nutrients slowly; re‑check after 30 minutes.
Hold pH between 5.5–6.0 for uptake.
Keep solution cool; avoid hot reservoirs.
Log EC/pH daily to catch drift. (Demo)`,
    },
    schemes: {
      q: "PM‑KISAN shows not credited — who to contact first?",
      a: `Confirm e‑KYC and Aadhaar seeding on the portal.
Visit CSC or Gram Panchayat for on‑ground verification.
Carry passbook, Aadhaar, and land records.
If stuck, escalate at the Block Agriculture Office.
Keep a receipt/ticket number for follow‑up. (Demo)`,
    },
    warehouse: {
      q: "Fumigation done — when is it safe to re‑enter the warehouse?",
      a: `Follow the label strictly for exposure and ventilation time.
Seal properly; place placards; no entry during treatment.
Ventilate as prescribed and test for residual gas.
Observe re‑entry interval and wear PPE on first entry.
Document all steps for audit. (Demo)`,
    },
    // Answer‑style demo (meta)
    style_now: {
      q: "Show me the ‘one‑line now’ style",
      a: `Now: Spraying is not advised till 10am (high rain chance).
Pick the 6–8am window tomorrow with dry leaf surface.
This is the short headline we always show first.
It helps quick decision‑making on field.
(Style demo)`,
    },
    style_why: {
      q: "Show me the ‘why this’ style",
      a: `Why: Rain + wind reduces efficacy and causes drift.
Leaf wetness causes runoff and poor deposition.
Early morning gives stable wind and better uptake.
This explains the logic behind the advice.
(Style demo)`,
    },
    style_next: {
      q: "Show me the ‘what to do next’ style",
      a: `Next: Recheck weather, prepare clean tank.
Measure dose carefully; avoid risky tank‑mixes.
Spray with steady pace; avoid overlaps.
Record date, dose, and field block for traceability.
(Style demo)`,
    },
    style_safety: {
      q: "Show me the ‘safety strip’ style",
      a: `Safety: Use PPE; follow label PHI and re‑entry.
Keep people/animals away during spray.
Don’t spray near water bodies in wind.
Wash equipment; store chemicals safely.
(Style demo)`,
    },
  },
  // Hindi (short, plain) — mirrors EN topics
  hi: {
    weather: {
      q: "कल सुबह नंदुरबार में कपास स्प्रे — बारिश होगी?",
      a: `10 बजे तक बारिश की संभावना ज़्यादा, हवा मध्यम.
गीली पत्ती पर स्प्रे न करें; सूखी पत्ती का इंतज़ार करें।
सुरक्षित विंडो: कल सुबह 6–8 बजे।
स्टिकर तभी जब लेबल अनुमति दे।
मिक्स करने से पहले मौसम दुबारा देखें। (डेमो)`,
    },
    nutrition: {
      q: "1 एकड़ मक्का 25 DAS — अभी यूरिया कितना?",
      a: `एक बार में सब न दें; स्प्लिट डोज दें।
आमतौर X–Y किग्रा/एकड़ (मिट्टी जाँच पर निर्भर)।
आधा अभी, आधा 7 दिन बाद हल्की सिंचाई के साथ।
मिट्टी नम रखें; जलभराव न होने दें।
पीला पन रहे तो सूक्ष्म पोषक जाँचें। (डेमो)`,
    },
    prices: {
      q: "कोटा धनिया आज का भाव व 7 दिन का ट्रेंड?",
      a: `आज का भाव मिड‑बैंड के आसपास दिख रहा।
पिछले 7 दिनों में हल्का अप‑ट्रेंड और कुछ वोलैटिलिटी।
आज बेचें तो रूट पहले से प्लान करें।
ग्रेड/नमी के अनुसार रियलाइज़्ड प्राइस बदलता है।
दैनिक अलर्ट के लिए मंडी सेव करें। (डेमो)`,
    },
    pest: {
      q: "मक्का में फॉल आर्मीवर्म — पहले क्या करें?",
      a: `IPM से शुरू करें: सुबह स्काउटिंग, हाथ से हटाना।
किनारे साफ रखें; अतिरिक्त नाइट्रोजन से बचें।
सीमा पार हो तो सिर्फ लेबल‑लिखित एक्टिव/डोज।
मोड बदलते रहें; PHI डायरी रखें।
तेज़ हवा/बारिश में स्प्रे न करें। (डेमो)`,
    },
    cattle: {
      q: "गर्मी में गाय कम खा रही — क्या करें?",
      a: `छाया व ठंडा‑साफ पानी हर समय दें।
ठंडे समय में खिलाएँ; इलेक्ट्रोलाइट दें (वेट सलाह से)।
हवादार शेड; फैन/फॉगर चलाएँ।
पीक गर्मी में भारी आहार न दें।
ठीक न हो तो वेट को दिखाएँ। (डेमो)`,
    },
    fisheries: {
      q: "रात में तालाब में ऑक्सीजन कम — क्या बदलें?",
      a: `शाम व सुबह एरेटर चलाएँ।
खुराक थोड़ी घटाएँ; ओवर‑स्टॉकिंग से बचें।
पहली फीड से पहले DO व pH जाँचें।
क्षारीयता/pH कम हो तो चूना दें।
उपकरण साफ रखें। (डेमो)`,
    },
    mushroom: {
      q: "बटन मशरूम भूरे पड़ रहे — फ़ौरन क्या करें?",
      a: `टेम्प थोड़ा घटाएँ; RH ~85–90% करें।
ताज़ी हवा दें पर बेड सूखे नहीं।
हाइजीन रखें; कैप को न छुएँ।
ज्यादा प्रभावित ट्रे हटा दें।
अगले चक्र के लिए रिकॉर्ड देखें। (डेमो)`,
    },
    hydro: {
      q: "हाइड्रोपोनिक लेट्यूस EC 2.6 — तुरन्त सुधार?",
      a: `सादा पानी से फ्लश कर EC ~1.2–1.6 करें।
धीरे‑धीरे न्यूट्रिएंट दें; 30 मिनट बाद जाँचें।
pH 5.5–6.0 रखें।
घोल ठंडा रखें; टैंक गरम न हो।
दैनिक EC/pH लॉग रखें। (डेमो)`,
    },
    schemes: {
      q: "PM‑KISAN क्रेडिट नहीं — पहले किससे मिलें?",
      a: `पोर्टल पर e‑KYC और आधार सीडिंग जाँचें।
CSC/ग्राम पंचायत पर सत्यापन कराएँ।
पासबुक, आधार, जमीन कागज़ साथ लें।
फँसे तो ब्लॉक कृषि कार्यालय में शिकायत करें।
रसीद/टिकट नंबर संभालें। (डेमो)`,
    },
    warehouse: {
      q: "फ्यूमिगेशन के बाद वेयरहाउस में कब प्रवेश सुरक्षित है?",
      a: `लेबल के समय व वेंटिलेशन नियम मानें।
सील/चेतावनी बोर्ड लगाएँ; ट्रीटमेंट में प्रवेश न करें।
वेंटिलेशन के बाद अवशेष गैस जाँचें।
री‑एंट्री इंटरवल रखें; पहली बार PPE पहनें।
प्रोसेस का रिकॉर्ड रखें। (डेमो)`,
    },
    style_now: {
      q: "‘अब क्या’ स्टाइल दिखाएँ",
      a: `अब: 10 बजे तक स्प्रे सलाह नहीं (बारिश जोखिम ऊँचा)।
कल 6–8 बजे का सूखा विंडो चुनें।
यह पहली, छोटी लाइन तेज़ निर्णय में मदद करती है।
मैदान में यही सबसे पहले दिखता है।
(स्टाइल डेमो)`,
    },
    style_why: {
      q: "‘क्यों’ स्टाइल दिखाएँ",
      a: `क्यों: बारिश/हवा से असर घटता, ड्रिफ्ट बढ़ता है।
गीली पत्ती पर दवा बह जाती है।
सुबह हवा स्थिर, अवशोषण बेहतर।
यह सलाह के पीछे का कारण समझाता है।
(स्टाइल डेमो)`,
    },
    style_next: {
      q: "‘अगला कदम’ स्टाइल दिखाएँ",
      a: `अगला: मौसम दुबारा देखें; साफ टैंक तैयार करें।
डोज नापकर दें; जोखिम भरे टैंक‑मिक्स से बचें।
स्थिर चाल से स्प्रे; ओवरलैप न करें।
तारीख/डोज/फील्ड ब्लॉक रिकॉर्ड करें।
(स्टाइल डेमो)`,
    },
    style_safety: {
      q: "‘सुरक्षा’ स्टाइल दिखाएँ",
      a: `सुरक्षा: PPE पहनें; PHI/री‑एंट्री मानें।
स्प्रे के समय लोग/पशु दूर रखें।
हवा में जलस्रोत के पास स्प्रे न करें।
उपकरण धोएँ; रसायन सुरक्षित रखें।
(स्टाइल डेमो)`,
    },
  },
  // Other languages fall back to EN for content (chips still clickable)
  mr: {} as any,
  gu: {} as any,
  bn: {} as any,
  ta: {} as any,
  te: {} as any,
};

function getQA(lang: LangKey, scenario: ScenarioKey) {
  const L = SCRIPTS[lang];
  if (L && L[scenario]) return L[scenario];
  return SCRIPTS.en[scenario];
}

export default function KrishiGPTInvestorDemoV2() {
  const [lang, setLang] = useState<LangKey>("en");
  const [scenario, setScenario] = useState<ScenarioKey>("weather");
  const [phase, setPhase] = useState<0 | 1 | 2>(0); // 0: Q, 1: Q+A, 2: hold
  const [autoplay, setAutoplay] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const qa = getQA(lang, scenario);

  // Autoplay through a curated order of scenarios
  const order: ScenarioKey[] = [
    "weather",
    "nutrition",
    "prices",
    "pest",
    "cattle",
    "fisheries",
    "mushroom",
    "hydro",
    "schemes",
    "warehouse",
  ];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!autoplay) return;
    timerRef.current && clearTimeout(timerRef.current);

    const schedule = () => {
      if (phase === 0) {
        timerRef.current = setTimeout(() => setPhase(1), 2100);
      } else if (phase === 1) {
        timerRef.current = setTimeout(() => setPhase(2), 3300);
      } else {
        timerRef.current = setTimeout(() => {
          const next = (idx + 1) % order.length;
          setIdx(next);
          setScenario(order[next]);
          setPhase(0);
        }, 900);
      }
    };

    schedule();
    return () => timerRef.current && clearTimeout(timerRef.current);
  }, [phase, autoplay, idx]);

  // When user switches language or scenario manually → reset phases and pause a bit
  useEffect(() => {
    setPhase(0);
  }, [lang, scenario]);

  const counters = [
    { label: "Conversations answered", value: "24,611" },
    { label: "Avg time to first step", value: "2.6 s" },
    { label: "Languages", value: "7" },
    { label: "Unique intents covered", value: "32" },
  ];

  const coverageTiles = [
    { key: "weather", title: "Weather", items: ["Spray window", "Wind/Rain gate", "Dew caution"] },
    { key: "nutrition", title: "Nutrition", items: ["Urea split", "Fertigation", "Micros check"] },
    { key: "prices", title: "Prices", items: ["Mandi today", "7‑day band", "Logistics"] },
    { key: "pest", title: "Pest & Disease", items: ["IPM first", "Label doses", "PHI diary"] },
    { key: "cattle", title: "Livestock", items: ["Heat stress", "Feeding time", "Vet escalation"] },
    { key: "fisheries", title: "Fisheries", items: ["DO check", "Feeding", "Liming"] },
    { key: "mushroom", title: "Mushroom", items: ["Temp/RH", "Hygiene", "Triage"] },
    { key: "hydro", title: "Hydroponics", items: ["EC/pH", "Flush", "Reservoir temp"] },
    { key: "schemes", title: "Schemes", items: ["PM‑KISAN", "PMFBY", "KVK contact"] },
    { key: "warehouse", title: "Warehouse", items: ["Fumigation", "Re‑entry", "PPE"] },
  ] as { key: ScenarioKey; title: string; items: string[] }[];

  const styleCards = [
    { key: "style_now", label: "One‑line now" },
    { key: "style_why", label: "Why this" },
    { key: "style_next", label: "Next steps" },
    { key: "style_safety", label: "Safety strip" },
  ] as { key: ScenarioKey; label: string }[];

  // A11y helper
  const btn = "cursor-pointer rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500";
  const chip = (active: boolean) =>
    `rounded-full px-3 py-1 text-xs ring-1 transition ${active ? "bg-emerald-600 text-white ring-emerald-600" : "bg-white text-gray-700 ring-gray-300 hover:bg-gray-100"}`;

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Top bar: simple, minimal green */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2 text-[12px] text-gray-700">
            {["Understand", "Check", "Guide", "Log"].map((x) => (
              <span key={x} className="rounded-full bg-emerald-50 px-3 py-1 ring-1 ring-emerald-200">{x}</span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {LANGS.map((l) => (
              <button
                key={l.key}
                onClick={() => setLang(l.key)}
                className={chip(l.key === lang)}
                aria-pressed={l.key === lang}
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => setAutoplay((v) => !v)}
              className={chip(!autoplay ? false : true)}
              title={autoplay ? "Pause demo" : "Play demo"}
            >
              {autoplay ? "Pause" : "Play"}
            </button>
          </div>
        </div>
      </div>

      {/* Hero with phone demo and counters */}
      <section className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <div className="grid items-start gap-10 md:grid-cols-2">
          {/* Phone mock — full viewport chat */}
          <div className="flex justify-center md:justify-start">
            <div className="relative h-[680px] w-[340px] rounded-[2.2rem] border border-gray-300 bg-gray-100 p-3 shadow-2xl">
              <div className="mx-auto flex h-full w-full flex-col rounded-[1.6rem] bg-white shadow-inner">
                {/* status */}
                <div className="flex items-center justify-between px-4 py-2 text-[11px] text-gray-500">
                  <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" />KrishiGPT</span>
                  <span>{LANGS.find((x) => x.key === lang)?.label}</span>
                </div>
                {/* chat viewport */}
                <div className="relative flex h-full flex-col justify-center gap-5 overflow-hidden px-4 pb-6 pt-2">
                  {/* Q */}
                  <div className={`flex justify-end transition-opacity duration-300 ${phase >= 0 ? "opacity-100" : "opacity-0"}`}>
                    <div className="max-w-[92%] rounded-2xl rounded-br-sm bg-emerald-600 px-4 py-3 text-[13px] leading-5 text-white shadow">
                      {qa.q}
                    </div>
                  </div>
                  {/* A */}
                  <div className={`flex justify-start transition-opacity duration-500 ${phase >= 1 ? "opacity-100" : "opacity-0"}`}>
                    <div className="max-w-[92%] whitespace-pre-line rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-3 text-[13px] leading-5 text-gray-800 shadow">
                      {qa.a}
                    </div>
                  </div>
                  <div className="pointer-events-none absolute bottom-2 left-0 right-0 text-center text-[10px] text-gray-400">Click any tile/chip to change the demo • Q shows first, then Answer</div>
                </div>
              </div>
              <div className="absolute left-1/2 top-2 h-1.5 w-24 -translate-x-1/2 rounded-full bg-black/20" />
            </div>
          </div>

          {/* Title + counters + quick controllers */}
          <div>
            <h1 className="text-3xl font-semibold leading-tight md:text-5xl">KrishiGPT — Agriculture answers in your language</h1>
            <p className="mt-3 max-w-xl text-gray-600 md:text-lg">Crops, cattle, fisheries, mushrooms, hydroponics, prices, weather, schemes. Clear, label‑safe steps you can do today.</p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[{ label: "Conversations answered", value: "24,611" }, { label: "Avg time to first step", value: "2.6 s" }, { label: "Languages", value: "7" }, { label: "Unique intents covered", value: "32" }].map((c) => (
                <div key={c.label} className="rounded-xl bg-white p-4 text-center shadow-sm ring-1 ring-gray-200">
                  <div className="text-xl font-semibold text-emerald-700">{c.value}</div>
                  <div className="text-[11px] text-gray-600">{c.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {coverageTiles.map((t) => (
                <button
                  key={t.key}
                  onClick={() => {
                    setAutoplay(false);
                    setScenario(t.key);
                  }}
                  className={btn}
                >
                  {t.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Coverage grid — clicking tiles updates phone */}
      <section id="coverage" className="bg-white/60">
        <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
          <h2 className="text-xl font-semibold md:text-2xl">Extent of queries we answer</h2>
          <p className="mt-1 text-sm text-gray-700">Click any card — the phone will show a relevant Q&A.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coverageTiles.map((u) => (
              <button
                key={u.key}
                onClick={() => {
                  setAutoplay(false);
                  setScenario(u.key);
                }}
                className="rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm hover:shadow"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                  <h3 className="text-sm font-semibold text-gray-900">{u.title}</h3>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                  {u.items.map((i) => (
                    <li key={i} className="flex items-start gap-2"><span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-gray-300" />{i}</li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Weather", "Prices", "Nutrition", "Pest & Disease", "Livestock", "Fisheries", "Mushroom", "Hydroponics", "Schemes", "Warehouse", "Export basics", "Logistics"].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  // map some tags to scenarios
                  const map: Record<string, ScenarioKey> = {
                    Weather: "weather",
                    Prices: "prices",
                    Nutrition: "nutrition",
                    "Pest & Disease": "pest",
                    Livestock: "cattle",
                    Fisheries: "fisheries",
                    Mushroom: "mushroom",
                    Hydroponics: "hydro",
                    Schemes: "schemes",
                    Warehouse: "warehouse",
                  } as any;
                  const k = map[tag] || "weather";
                  setAutoplay(false);
                  setScenario(k);
                }}
                className="rounded-full bg-white px-4 py-2 text-center text-[12px] text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Answer style — clickable cards */}
      <section className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <h2 className="text-xl font-semibold md:text-2xl">Answer style (always the same)</h2>
        <p className="mt-1 text-sm text-gray-700">Click a card to preview the style on the phone.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {styleCards.map((s) => (
            <button
              key={s.key}
              onClick={() => {
                setAutoplay(false);
                setScenario(s.key);
              }}
              className="rounded-2xl border border-gray-200 bg-white p-4 text-left text-sm text-gray-800 shadow-sm hover:shadow"
            >
              {s.label}
            </button>
          ))}
        </div>
      </section>

      {/* Government help — clickable tiles */}
      <section className="bg-white/60">
        <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
          <h2 className="text-xl font-semibold md:text-2xl">Government support (demo)</h2>
          <p className="mt-1 text-sm text-gray-700">Click a tile — the phone will show a relevant PM‑KISAN / grievance Q&A.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {["CSC / Gram Panchayat (e‑KYC)", "Block Agriculture Office (escalation)", "KVK / District Agriculture Office"].map((x) => (
              <button
                key={x}
                onClick={() => {
                  setAutoplay(false);
                  setScenario("schemes");
                }}
                className="rounded-2xl border border-gray-200 bg-white p-4 text-left text-sm text-gray-800 shadow-sm hover:shadow"
              >
                {x}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Safety + CTAs */}
      <section className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <div className="text-lg font-semibold text-emerald-900">Safety, compliance, trust</div>
          <div className="mt-3 grid gap-3 md:grid-cols-4">
            {["IPM‑first, label‑within doses", "PHI & re‑entry reminders", "Weather & wind checks", "Escalate to local expert when risky"].map((s) => (
              <div key={s} className="rounded-xl bg-white/70 p-3 text-sm text-emerald-900 ring-1 ring-emerald-200">{s}</div>
            ))}
          </div>
          <div className="mt-3 text-xs text-emerald-900/80">Educational advisory. Always read product labels & follow local guidance.</div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#coverage" className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700">See coverage</a>
          <a href="https://forms.gle/" className="rounded-xl border border-emerald-600 px-5 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">Join the beta</a>
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-white/80">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center text-xs text-gray-500">© {new Date().getFullYear()} KrishiGPT — Educational advisory only.</div>
      </footer>
    </main>
  );
}
