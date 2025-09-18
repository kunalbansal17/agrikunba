// components/KrishiGPTDemo.js
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const LANGS = [
  { key: "en", label: "English" },
  { key: "hi", label: "हिंदी" },
];

const SCENARIOS = ["weather", "prices", "pest", "cattle", "fisheries", "warehouse"];

const SCRIPTS = {
  en: {
    weather: { q: "Will it rain tomorrow morning in Nandurbar for my cotton spray?",
      a: `Rain chance stays high until ~10am with moderate wind.
Wait for a dry leaf surface; avoid spraying on wet foliage.
Safer spray window looks like early tomorrow 6–8am.
Recheck weather just before mixing. (Demo)` },
    prices:  { q: "Today's mandi price for coriander in Kota and last 7-day trend?",
      a: `Today sits near the mid-band with mild volatility.
Route early if selling; grade and moisture move the final price.
Save this mandi to receive daily pings. (Demo)` },
    pest:    { q: "Fall armyworm in maize — what should I do first?",
      a: `Start with IPM basics and scout early.
If threshold crosses, use only label-listed actives/doses.
Rotate modes of action; keep a PHI diary. (Demo)` },
    cattle:  { q: "Cow eating less due to heat — quick help?",
      a: `Shade and cool, clean water through the day.
Feed during cooler hours; add electrolytes as advised by vet.
Improve airflow; watch dehydration. (Demo)` },
    fisheries:{ q: "Tilapia pond oxygen is low at night — what to change?",
      a: `Run aerators late evening and early morning.
Reduce feed temporarily; check DO and pH before first feed.
Consider liming if alkalinity is low. (Demo)` },
    warehouse:{ q: "Fumigation done — when is it safe to re-enter the warehouse?",
      a: `Follow the label for exposure and ventilation time.
Post placards; no entry during treatment.
Ventilate and test residual gas before re-entry. (Demo)` },
  },
  hi: {
    weather:  { q: "कल सुबह नंदुरबार में कपास स्प्रे — बारिश होगी?",
      a: `10 बजे तक बारिश की संभावना ज़्यादा, हवा मध्यम।
गीली पत्ती पर स्प्रे न करें; सूखी पत्ती का इंतज़ार करें।
सुरक्षित विंडो: कल सुबह 6–8 बजे। (डेमो)` },
    prices:   { q: "कोटा धनिया आज का भाव व 7 दिन का ट्रेंड?",
      a: `आज का भाव मिड-बैंड के आसपास।
रूट पहले से प्लान करें; ग्रेड/नमी से भाव बदलता है। (डेमो)` },
    pest:     { q: "मक्का में फॉल आर्मीवर्म — पहले क्या करें?",
      a: `IPM से शुरू करें; सीमा पार हो तो लेबल-लिखित डोज ही दें।
मोड बदलते रहें; PHI डायरी रखें। (डेमो)` },
    cattle:   { q: "गर्मी में गाय कम खा रही — क्या करें?",
      a: `छाया व ठंडा-साफ पानी दें।
ठंडे समय में खिलाएँ; इलेक्ट्रोलाइट दें। (डेमो)` },
    fisheries:{ q: "रात में तालाब में ऑक्सीजन कम — क्या बदलें?",
      a: `शाम व सुबह एरेटर चलाएँ।
खुराक घटाएँ; DO/pH जाँचें। (डेमो)` },
    warehouse:{ q: "फ्यूमिगेशन के बाद वेयरहाउस में कब प्रवेश सुरक्षित है?",
      a: `लेबल समय व वेंटिलेशन मानें; चेतावनी बोर्ड लगाएँ।
वेंटिलेशन के बाद अवशेष गैस जाँचें। (डेमो)` },
  },
};

function getQA(lang, scenario) {
  const L = SCRIPTS[lang] || SCRIPTS.en;
  return L[scenario] || SCRIPTS.en.weather;
}

export default function KrishiGPTDemo() {
  const [lang, setLang] = useState("en");
  const [scenario, setScenario] = useState("weather");
  const [phase, setPhase] = useState(0); // 0 Q, 1 A, 2 hold
  const [autoplay, setAutoplay] = useState(true);
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);

  const qa = getQA(lang, scenario);

  useEffect(() => {
    if (!autoplay) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    if (phase === 0) timerRef.current = setTimeout(() => setPhase(1), 2000);
    else if (phase === 1) timerRef.current = setTimeout(() => setPhase(2), 3200);
    else timerRef.current = setTimeout(() => {
      const next = (idx + 1) % SCENARIOS.length;
      setIdx(next); setScenario(SCENARIOS[next]); setPhase(0);
    }, 900);
    return () => timerRef.current && clearTimeout(timerRef.current);
  }, [phase, autoplay, idx]);

  useEffect(() => setPhase(0), [lang, scenario]);

  const chip = (active) =>
    `rounded-full px-3 py-1 text-xs ring-2 transition ${
      active ? "bg-white text-gray-800 ring-emerald-600"
             : "bg-white text-gray-700 ring-gray-300 hover:ring-emerald-400"
    }`;

  return (
    <section className="full-bleed bg-gray-50">

      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <div className="grid items-start gap-10 md:grid-cols-2">
          {/* Phone */}
          <div className="flex justify-center md:justify-start">
            <div className="relative h-[680px] w-[340px] rounded-[2.2rem] border border-gray-300 bg-gray-100 p-3 shadow-2xl">
              <div className="mx-auto flex h-full w-full flex-col rounded-[1.6rem] bg-white shadow-inner">
                
                <div className="flex items-center justify-between px-4 py-2 text-[11px] text-gray-500">
                
                  <span className="inline-flex items-center gap-1">
                    
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />KrishiGPT
                  </span>
                  <span>{LANGS.find((x) => x.key === lang)?.label}</span>
                </div>
                <div className="relative flex h-full flex-col justify-center gap-5 overflow-hidden px-4 pb-6 pt-2">
                  <div className={`flex justify-end transition-opacity duration-300 ${phase >= 0 ? "opacity-100" : "opacity-0"}`}>
                    <div className="max-w-[92%] rounded-2xl rounded-br-sm bg-emerald-600 px-4 py-3 text-[13px] leading-5 text-white shadow">
                      {qa.q}
                    </div>
                  </div>
                  <div className={`flex justify-start transition-opacity duration-500 ${phase >= 1 ? "opacity-100" : "opacity-0"}`}>
                    <div className="max-w-[92%] whitespace-pre-line rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-3 text-[13px] leading-5 text-gray-800 shadow">
                      {qa.a}
                    </div>
                  </div>
                  <div className="pointer-events-none absolute bottom-2 left-0 right-0 text-center text-[10px] text-gray-400">
                    Tap any chip to change the demo • Q shows first, then Answer
                  </div>
                </div>
              </div>
              <div className="absolute left-1/2 top-2 h-1.5 w-24 -translate-x-1/2 rounded-full bg-black/20" />
            </div>
          </div>

          {/* Copy */}
          <div>



        <div className="mx-auto flex max-w-2xl flex-col gap-4 px py md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2 text-[12px] text-gray-700">
            {[].map((x) => (
              <span key={x} className="rounded-full bg-emerald-50 px-3 py-1 ring-1 ring-emerald-200">{x}</span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {LANGS.map((l) => (
              <button key={l.key} onClick={() => setLang(l.key)} className={chip(l.key === lang)}>
                {l.label}
              </button>
            ))}
            <button onClick={() => setAutoplay((v) => !v)} className={chip(autoplay)}>
              {autoplay ? "Pause" : "Play"}
            </button>
          </div>
        </div>
    



            <h2 className="text-3xl font-semibold leading-tight md:text-5xl">
              KrishiGPT - your personal agriculture companion
            </h2>
            <p className="mt-3 max-w-xl text-gray-600 md:text-lg">
              Crops, cattle, fisheries, mandi prices, weather, government schemes. Crisp, Information coverage.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {SCENARIOS.map((key) => (
                <button
                  key={key}
                  onClick={() => { setScenario(key); setAutoplay(false); setPhase(0); }}
                  className="cursor-pointer rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Conversations answered", value: "24,611" },
                { label: "Avg time to first step", value: "2.6 s" },
                { label: "Languages", value: "7" },
                { label: "Unique intents covered", value: "32" },
              ].map((c) => (
                <div key={c.label} className="rounded-xl bg-white p-4 text-center shadow-sm ring-1 ring-gray-200">
                  <div className="text-xl font-semibold text-emerald-700">{c.value}</div>
                  <div className="text-[11px] text-gray-600">{c.label}</div>
                </div>
              ))}
            </div>
            
            {/* CTA: Experience Now */}
<div className="mt-8">
  <Link
    href="/krishigpt/live"
    className="inline-block rounded-lg bg-emerald-600 px-6 py-3 text-white font-semibold shadow-lg hover:bg-emerald-700 hover:scale-105 transition"
  >
    🚀 Experience KrishiGPT Now
  </Link>
</div>
          </div>
          
        </div>
        
      </div>
    </section>
  );
}
