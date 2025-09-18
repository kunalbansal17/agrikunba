// Always render IST in a stable 24h format on both server & client.
// If no timestamp yet, show an em dash to avoid SSR/client drift.
const fmtTimeIST = (value) => {
  if (!value) return "—";
  const dt = typeof value === "string" ? new Date(value) : new Date(value);
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  }).format(dt);
};


import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ArrowDownRight, ArrowUpRight, Bell, Info, Map, TrendingUp } from "lucide-react";


// --------------------------- i18n -----------------------------------------
const translations = {
  en: {
    title: "Commodity Matrix - Demo",
    investor_mvp: "MVP",
    last_updated: "Last updated",
    badge_latency: "Latency < 30 min",
    badge_markets: (n) => `${n} markets reporting`,

    why_title: "Why this matters",
    why_sub: "Fragmented signals → actionable decisions",
    why_b1: "Prices shift by location, grade, and value‑chain level (farm → mandi → wholesale → retail).",
    why_b2: "We standardize units/grades and surface spreads, basis, and anomalies—the levers traders act on.",
    why_b3: "Start with Turmeric (Nizamabad anchor), then scale to crops, companies, and global benchmarks.",
    why_b4: "Transparent methodology, timestamps, and alert‑ready workflows build trust.",

    filters_commodity: "Commodity",
    filters_level: "Level",
    filters_state: "State",
    filters_variety: "Variety / Grade",
    filters_unit: "Unit",

    landed_cost: "Landed‑Cost & Spread",
    landed_sub: "Delivered margin simulator",
    i_landed: "Delivered cost from Origin to Destination after freight/handling/wastage; compares to destination price to show margin today.",

    basis_heatmap: "Basis Heatmap",
    basis_sub: "Spot − Futures (near)",
    i_basis: "Spot minus near‑month futures (NCDEX). Large deviations from seasonal norms can signal hedge/carry opportunities.",

    nowcast: "Nowcast Barometer",
    nowcast_sub: "Tightness score",
    i_nowcast: "0–100 tightness score built from arrivals (supply), rainfall anomaly (crop stress), and sowing progress (future supply).",

    anomaly: "Anomaly Radar",
    anomaly_sub: "Freight‑adjusted gaps",
    i_anomaly: "Freight‑adjusted price gaps between neighboring markets; highlights unusual spreads worth investigating.",

    national_price: "National price",
    national_sub: "Median across reporting markets",

    risers: "Top 5 risers",
    fallers: "Top 5 fallers",
    dd_change: "d/d change",

    value_chain: "Value‑chain ladder",
    i_ladder: "Same‑day price steps across Farm → Mandi → Wholesale → Retail to reveal margins and leakages.",

    india_map: "India map",
    map_sub: "Heatmap by price / change",

    trend: "Trend (90 days)",
    trend_sub: "Median price with band",

    seasonality: "Seasonality",
    seasonality_sub: "Average monthly pattern",
    i_seasonality: "Typical monthly pattern from multi‑year history; helps separate season effects from true shocks.",

    arrivals: "Arrivals volume",
    arrivals_sub: "WoW delta",

    rainfall: "Rainfall anomaly",
    rainfall_sub: "% vs normal (IMD)",

    sowing: "Sowing progress",
    sowing_sub: "% of normal/target",

    prediction: "Prediction & backtest",
    prediction_sub: "Transparent forecasts with bands",
    i_prediction: "Short‑term forecast with confidence band; we show MAE/MAPE vs naïve baselines, plus top drivers.",

    workflow: "Workflow & alerts",
    workflow_sub: "From signal to action",

    method: "Methodology & data lineage",
    method_sub: "How we standardize, de‑noise, and stitch sources",

    coverage_title: "Markets reporting today",
    coverage_sub: "Coverage",
    latency_title: "Avg latency",
    latency_sub: "Ingestion + processing",
    last_ingest_title: "Last ingestion",
    last_ingest_sub: "Pipeline health",

    roadmap: "Roadmap & GTM",
    roadmap_sub: "Next crops · global overlays · company pages",

    footer_cta: "Questions?",
    talk_to_us: "Talk to us",
    disclaimer: "Information only — not investment advice.",

    // Caselet
    caselet_title: "Caselet — Telangana mill (pilot)",
    caselet_sub: "Real ROI from alerts & arbitrage",
    caselet_b1: "Improved buy by ₹180/qtl on 520 qtls in Aug.",
    caselet_b2: "Caught 3 basis anomalies (>₹400/qtl) with alerts.",
    caselet_b3: "Saved ~₹93,600 vs baseline; Pro Team @ ₹9,999 → 9× ROI.",

    // UI bits
    delivered_cost: "Delivered cost",
    spread_vs_dest: "Spread vs dest",
    inside_band: "Inside band",
    outside_band: "Outside band",
    loose_tight_hint: "0 = loose · 100 = very tight",
    preview: "Preview",
    whatsapp_preview: (c, unit, b, th, sp) => `WhatsApp — ${c}: basis ${unit} ${b} (th ${th}), spread ${sp}. Tap to hedge → NCDEX.`,
  },

  hi: {
    title: "कृषि कीमत अनुमान — भारत",
    investor_mvp: "निवेशक एमवीपी",
    last_updated: "अंतिम अद्यतन",
    badge_latency: "विलंब < 30 मिनट",
    badge_markets: (n) => `${n} रिपोर्टिंग बाजार`,

    why_title: "यह क्यों ज़रूरी है",
    why_sub: "बिखरे संकेत → क्रियाशील निर्णय",
    why_b1: "कीमतें स्थान, किस्म/ग्रेड और वैल्यू‑चेन स्तर (फार्म → मंडी → थोक → खुदरा) पर बदलती हैं।",
    why_b2: "हम इकाइयों/ग्रेड को मानकीकृत कर स्प्रेड, बेसिस और असामान्यताओं को सामने लाते हैं—यही निर्णय के लीवर हैं।",
    why_b3: "टर्मरिक (निज़ामाबाद) से शुरू, फिर अन्य फसलें, कंपनियाँ और वैश्विक बेंचमार्क तक विस्तार।",
    why_b4: "पारदर्शी कार्यविधि, टाइमस्टैम्प और अलर्ट‑रेडी वर्कफ़्लो भरोसा बनाते हैं।",

    filters_commodity: "वस्तु",
    filters_level: "स्तर",
    filters_state: "राज्य",
    filters_variety: "किस्म / ग्रेड",
    filters_unit: "इकाई",

    landed_cost: "लैंडेड कॉस्ट व स्प्रेड",
    landed_sub: "डिलिवर्ड मार्जिन सिम्युलेटर",
    i_landed: "मूल स्थान से गंतव्य तक मालभाड़ा/हैंडलिंग/वेस्टेज जोड़कर डिलिवर्ड कॉस्ट; गंतव्य कीमत से तुलना कर आज का मार्जिन।",

    basis_heatmap: "बेसिस हीटमैप",
    basis_sub: "स्पॉट − वायदा (निकट)",
    i_basis: "स्पॉट मूल्य − निकट माह वायदा (NCDEX)। मौसमी दायरे से बड़ा विचलन हेज/कैरी अवसर दिखा सकता है।",

    nowcast: "नाउकास्ट बैरोमीटर",
    nowcast_sub: "टाइटनेस स्कोर",
    i_nowcast: "आवक, वर्षा अपवाद और बोवाई प्रगति से बना 0–100 टाइटनेस स्कोर।",

    anomaly: "एनोमली रडार",
    anomaly_sub: "मालभाड़ा‑समायोजित अंतर",
    i_anomaly: "पड़ोसी बाजारों के बीच मालभाड़ा‑समायोजित मूल्य अंतर; असामान्य स्प्रेड्स को हाइलाइट करता है।",

    national_price: "राष्ट्रीय मूल्य",
    national_sub: "रिपोर्टिंग बाजारों का माध्य",

    risers: "शीर्ष 5 बढ़त",
    fallers: "शीर्ष 5 गिरावट",
    dd_change: "दैनिक बदलाव",

    value_chain: "वैल्यू‑चेन सीढ़ी",
    i_ladder: "उसी दिन फार्म → मंडी → थोक → खुदरा कीमतें—मार्जिन/लीकेज दिखाने हेतु।",

    india_map: "भारत मानचित्र",
    map_sub: "मूल्य / बदलाव हीटमैप",

    trend: "ट्रेंड (90 दिन)",
    trend_sub: "माध्य मूल्य व बैंड",

    seasonality: "मौसमी पैटर्न",
    seasonality_sub: "औसत मासिक पैटर्न",
    i_seasonality: "कई वर्षों के औसत से मासिक पैटर्न; मौसम प्रभाव बनाम असली झटके अलग करता है।",

    arrivals: "आवक",
    arrivals_sub: "सप्ताह-दर-सप्ताह",

    rainfall: "वर्षा अपवाद",
    rainfall_sub: "% बनाम सामान्य (IMD)",

    sowing: "बोवाई प्रगति",
    sowing_sub: "% बनाम लक्ष्य",

    prediction: "पूर्वानुमान व बैकटेस्ट",
    prediction_sub: "विश्वसनीयता बैंड सहित",
    i_prediction: "कम अवधि का पूर्वानुमान; MAE/MAPE और शीर्ष ड्राइवर भी दिखाते हैं।",

    workflow: "वर्कफ़्लो व अलर्ट",
    workflow_sub: "सिग्नल से कार्रवाई",

    method: "कार्यविधि व डेटा वंशावली",
    method_sub: "मानकीकरण, डी‑नॉइज़, स्रोत संयोजन",

    coverage_title: "आज रिपोर्टिंग बाजार",
    coverage_sub: "कवरेज",
    latency_title: "औसत विलंब",
    latency_sub: "इनजेशन + प्रोसेसिंग",
    last_ingest_title: "अंतिम इनजेशन",
    last_ingest_sub: "पाइपलाइन स्थिति",

    roadmap: "रोडमैप व GTM",
    roadmap_sub: "अगली फसलें · वैश्विक ओवरले · कंपनी पेज",

    footer_cta: "कोई प्रश्न?",
    talk_to_us: "हमसे बात करें",
    disclaimer: "यह निवेश सलाह नहीं है।",

    caselet_title: "केसलेट — तेलंगाना मिल (पायलट)",
    caselet_sub: "अलर्ट व आर्बिट्राज से वास्तविक ROI",
    caselet_b1: "अगस्त में 520 क्विंटल पर ₹180/क्विंटल बेहतर खरीद।",
    caselet_b2: "अलर्ट से >₹400/क्विंटल वाले 3 बेसिस एनोमली पकड़ीं।",
    caselet_b3: "~₹93,600 की बचत; Pro Team ₹9,999 → 9× ROI।",

    delivered_cost: "डिलिवर्ड कॉस्ट",
    spread_vs_dest: "गंतव्य के सापेक्ष स्प्रेड",
    inside_band: "बैंड के भीतर",
    outside_band: "बैंड से बाहर",
    loose_tight_hint: "0 = ढीला · 100 = कसा हुआ",
    preview: "पूर्वावलोकन",
    whatsapp_preview: (c, unit, b, th, sp) => `WhatsApp — ${c}: बेसिस ${unit} ${b} (थ ${th}), स्प्रेड ${sp}. हेज करें → NCDEX`,
  },

  // Light-weight translations for other languages (can be extended)
  mr: {
    title: "किंमत अंदाज — भारत",
    investor_mvp: "गुंतवणूकदार MVP",
    last_updated: "शेवटचे अद्यतन",
    badge_latency: "विलंब < 30 मिनिटे",
    badge_markets: (n) => `${n} बाजार अहवाल देत आहेत`,
    why_title: "हे का महत्त्वाचे",
    why_sub: "विखुरलेले संकेत → कृतीयोग्य निर्णय",
    landed_cost: "लॅंडेड कॉस्ट व स्प्रेड",
    basis_heatmap: "बेसिस हीटमॅप",
    nowcast: "नाउकास्ट बॅरोमीटर",
    anomaly: "अॅनॉमली रडार",
    national_price: "राष्ट्रीय किंमत",
    risers: "टॉप 5 वाढ",
    fallers: "टॉप 5 घसरण",
    dd_change: "दिवसागणिक बदल",
    value_chain: "व्हॅल्यू‑चेन शिडी",
    india_map: "भारत नकाशा",
    trend: "ट्रेंड (90 दिवस)",
    seasonality: "हंगामी पॅटर्न",
    arrivals: "आवक",
    rainfall: "पावसातील अपवाद",
    sowing: "पेरणी प्रगती",
    prediction: "भविष्यवाणी व बॅकटेस्ट",
    workflow: "वर्कफ्लो व अलर्ट",
    method: "कार्यपद्धती व डेटा वंशावळ",
    roadmap: "रोडमॅप व GTM",
    footer_cta: "प्रश्न?",
    talk_to_us: "आमच्याशी बोला",
    disclaimer: "ही गुंतवणूक सल्ला नाही.",
  },
  te: {
    title: "ధర అంచనా — భారత్",
    investor_mvp: "ఇన్వెస్టర్ MVP",
    last_updated: "చివరి నవీకరణ",
    badge_latency: "విలంబం < 30 నిమి",
    badge_markets: (n) => `${n} మార్కెట్లు నివేదిస్తున్నాయి`,
    why_title: "ఇది ఎందుకు ముఖ్యం",
    why_sub: "చిన్న భాగాల సంకేతాలు → చర్యాత్మక నిర్ణయాలు",
    landed_cost: "ల్యాండెడ్ ఖర్చు & స్ప్రెడ్",
    basis_heatmap: "బేసిస్ హీట్‌మ్యాప్",
    nowcast: "నౌకాస్ట్ బారోమీటర్",
    anomaly: "అనామలి రాడార్",
    national_price: "జాతీయ ధర",
    risers: "టాప్ 5 పెరుగుదల",
    fallers: "టాప్ 5 పడిపోవు",
    dd_change: "రోజువారీ మార్పు",
    value_chain: "విలువ గొలుసు మెట్టు",
    india_map: "భారత మ్యాప్",
    trend: "ప్రవణత (90 రోజులు)",
    seasonality: "ఋతుపవన ప్యాటర్న్",
    arrivals: "రాకలు",
    rainfall: "వర్షపాతం అసాధారణత",
    sowing: "విత్తన పురోగతి",
    prediction: "అంచనా & బ్యాక్‌టెస్ట్",
    workflow: "వర్క్‌ఫ్లో & అలర్ట్లు",
    method: "పద్ధతి & డేటా లినియేజ్",
    roadmap: "రోడ్మ్యాప్ & GTM",
    footer_cta: "ప్రశ్నలేనా?",
    talk_to_us: "మాతో మాట్లాడండి",
    disclaimer: "ఇది పెట్టుబడి సలహా కాదు.",
  },
  ta: {
    title: "விலை முன்னறிவு — இந்தியா",
    investor_mvp: "முதலீட்டாளர் MVP",
    last_updated: "கடைசியாக புதுப்பிப்பு",
    badge_latency: "தாமதம் < 30 நிமி",
    badge_markets: (n) => `${n} சந்தைகள் அறிக்கை செய்கின்றன`,
    why_title: "ஏன் இது முக்கியம்",
    why_sub: "சிதறிய சிக்னல்கள் → செயல் முடிவு",
    landed_cost: "லாண்டட் காஸ்ட் & ஸ்ப்ரெட்",
    basis_heatmap: "பேசிஸ் ஹீட்மாப்",
    nowcast: "நௌகாஸ்ட் பரோமீட்டர்",
    anomaly: "அனாமலி ரேடார்",
    national_price: "தேசிய விலை",
    risers: "சிறந்த 5 உயர்வு",
    fallers: "சிறந்த 5 சரிவு",
    dd_change: "நாள்/நாள் மாற்றம்",
    value_chain: "மதிப்புச்சங்கு ஏணி",
    india_map: "இந்தியா வரைபடம்",
    trend: "போக்கு (90 நாட்கள்)",
    seasonality: "காலநிலை சார்பு",
    arrivals: "வரவுகள்",
    rainfall: "மழை மாறுபாடு",
    sowing: "விதைப்பு முன்னேற்றம்",
    prediction: "முன்னறிவு & பேக்டெஸ்ட்",
    workflow: "பணியியல் & அலர்ட்கள்",
    method: "முறையும் தரவு மரபும்",
    roadmap: "ரோட்மேப் & GTM",
    footer_cta: "கேள்விகளா?",
    talk_to_us: "எங்களை தொடர்பு கொள்ளவும்",
    disclaimer: "இது முதலீட்டு ஆலோசனை அல்ல.",
  },
  bn: {
    title: "মূল্য পূর্বাভাস — ভারত",
    investor_mvp: "বিনিয়োগকারী MVP",
    last_updated: "সর্বশেষ আপডেট",
    badge_latency: "বিলম্ব < ৩০ মিনিট",
    badge_markets: (n) => `${n} বাজার রিপোর্ট করছে`,
    why_title: "কেন এটি দরকার",
    why_sub: "বিক্ষিপ্ত সংকেত → কার্যকর সিদ্ধান্ত",
    landed_cost: "ল্যান্ডেড কস্ট ও স্প্রেড",
    basis_heatmap: "বেসিস হিটম্যাপ",
    nowcast: "নাউকাস্ট ব্যারোমিটার",
    anomaly: "অ্যানোমালি রাডার",
    national_price: "জাতীয় মূল্য",
    risers: "টপ ৫ বাড়তি",
    fallers: "টপ ৫ কমতি",
    dd_change: "দিন-ওভার-দিন পরিবর্তন",
    value_chain: "ভ্যালু-চেইন সিঁড়ি",
    india_map: "ভারত মানচিত্র",
    trend: "ট্রেন্ড (৯০ দিন)",
    seasonality: "ঋতুভিত্তিক ধারা",
    arrivals: "আগত",
    rainfall: "বৃষ্টিপাত অস্বাভাবিকতা",
    sowing: "বপন অগ্রগতি",
    prediction: "পূর্বাভাস ও ব্যাকটেস্ট",
    workflow: "ওয়ার্কফ্লো ও অ্যালার্ট",
    method: "পদ্ধতি ও ডেটা লিনিয়েজ",
    roadmap: "রোডম্যাপ ও GTM",
    footer_cta: "প্রশ্ন?",
    talk_to_us: "আমাদের সাথে কথা বলুন",
    disclaimer: "এটি বিনিয়োগ পরামর্শ নয়।",
  },
};

function useI18n() {
  const [lang, setLang] = useState("en");
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
    if (saved) setLang(saved);
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("lang", lang);
  }, [lang]);
  const t = (key, ...args) => {
    const pack = translations[lang] || translations.en;
    const val = pack[key] ?? translations.en[key] ?? key;
    return typeof val === "function" ? val(...args) : val;
  };
  return { lang, setLang, t };
}

// --------------------------- Utility -------------------------------------
const fmtIN = (n, d = 0) => Number(n).toLocaleString("en-IN", { maximumFractionDigits: d });
const pct = (n) => `${(n >= 0 ? "+" : "") + Number(n).toFixed(1)}%`;
const day = (dt, d) => new Date(dt.getTime() + d * 86400000);
const iso = (dt) => dt.toISOString().slice(0, 10);

// --------------------------- Mock Data ------------------------------------
function makeSeries(len = 120, base = 11500, amp = 220) {
  const out = [];
  const today = new Date();
  for (let i = len - 1; i >= 0; i--) {
    const dt = new Date(today.getTime() - i * 86400000);
    const t = (len - i);
    // Smooth, repeatable wiggle (no random):
    const wave = Math.sin(t / 9) * 0.6 + Math.sin(t / 17) * 0.4;
    const price = Math.max(6000, Math.round(base + amp * wave));
    out.push({ date: dt.toISOString().slice(0, 10), price });
  }
  return out;
}

function mockPrices(commodity = "Turmeric", level = "mandi") {
  const mk = (market, state, base) => {
    const series = makeSeries(150, base, 200);
    const last = series[series.length - 1].price;
    const prev = series[series.length - 2].price;
    const last7 = series[Math.max(0, series.length - 8)].price;
    return {
      market,
      state,
      type: level,
      date: iso(new Date()),
      price: last,
      changeDay: ((last - prev) / prev) * 100,
      changeWeek: ((last - last7) / last7) * 100,
      series,
    };
  };
  const markets = [
    mk("Nizamabad", "Telangana", 11800),
    mk("Erode", "Tamil Nadu", 12100),
    mk("Sangli", "Maharashtra", 11250),
    mk("Latur", "Maharashtra", 11480),
    mk("Warangal", "Telangana", 11600),
    mk("Guntur", "Andhra Pradesh", 11320),
  ];
  const drivers = { arrivalsWoW: -6.5, rainfallAnomaly: -14.0, sowingProgress: 91.0 };
  const futures = { near: 12080, next: 12240, third: 12410 };
  return { updatedAt: new Date().toISOString(), unit: "₹/qtl", commodity, level, markets, drivers, futures };
}

async function fetchPrices(commodity, level, stateFilter) {
  try {
    const q = new URLSearchParams({ commodity, level, state: stateFilter || "", days: "150" });
   // const res = await fetch(`/api/prices?${q.toString()}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json?.markets?.length) throw new Error("empty markets");
    return json;
  } catch {
    return mockPrices(commodity, level);
  }
}

// --------------------------- Ticker styles --------------------------------
const TickerStyles = () => (
  <style jsx global>{`
    @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    .marquee { white-space: nowrap; overflow: hidden; position: relative; }
    .marquee__track { display: inline-block; padding-left: 100%; animation: marquee 42s linear infinite; }
  `}</style>
);

// --------------------------- UI helpers -----------------------------------
const Badge = ({ children, tone = "neutral" }) => {
  const base = "rounded-full border px-2 py-0.5 text-xs";
  const tones = { neutral: "border-gray-300 text-gray-600", up: "border-emerald-200 text-emerald-700", down: "border-rose-200 text-rose-700" };
  return <span className={`${base} ${tones[tone]}`}>{children}</span>;
};

const Card = ({ title, subtitle, right, className = "", children }) => (
  <div className={`rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}>
    {(title || right || subtitle) && (
      <div className="flex items-start justify-between gap-3 border-b border-gray-100 p-4">
        <div>
          {title && <h3 className="text-sm font-semibold text-gray-800">{title}</h3>}
          {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
        </div>
        {right}
      </div>
    )}
    <div className="p-4">{children}</div>
  </div>
);

const InfoTooltip = ({ text }) => {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        aria-label="info"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setOpen(false)}
        className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:text-gray-700"
      >
        <Info className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="absolute left-1/2 top-6 z-20 w-64 -translate-x-1/2 rounded-md bg-gray-900 p-2 text-xs text-white shadow-lg">
          {text}
        </div>
      )}
    </span>
  );
};

const TitleWithInfo = ({ title, info }) => (
  <div className="flex items-center">
    <span>{title}</span>
    {info ? <InfoTooltip text={info} /> : null}
  </div>
);

const LanguageSelector = ({ lang, setLang }) => (
  <select value={lang} onChange={(e) => setLang(e.target.value)} className="rounded-lg border border-gray-300 p-2 text-sm">
    <option value="en">English</option>
    <option value="hi">हिंदी</option>
    <option value="mr">मराठी</option>
    <option value="te">తెలుగు</option>
    <option value="ta">தமிழ்</option>
    <option value="bn">বাংলা</option>
  </select>
);

// --------------------------- Page -----------------------------------------
export default function PredictPrices() {
  const { lang, setLang, t } = useI18n();

  const [commodity, setCommodity] = useState("Turmeric");
  const [level, setLevel] = useState("mandi");
  const [stateFilter, setStateFilter] = useState("");
  const [data, setData] = useState(null);
  const [freight, setFreight] = useState(350);
  const [origin, setOrigin] = useState("Nizamabad, Telangana");
  const [destination, setDestination] = useState("Nagpur, Maharashtra");
  const [alertBasis, setAlertBasis] = useState(400);
  const [alertSpread, setAlertSpread] = useState(600);

  const queryKey = `${commodity}|${level}|${stateFilter}`;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetchPrices(commodity, level, stateFilter);
      if (!cancelled) setData(res);
    })();
    const id = setInterval(() => {
      fetchPrices(commodity, level, stateFilter).then((res) => !cancelled && setData(res));
    }, 60_000);
    return () => { cancelled = true; clearInterval(id); };
  }, [queryKey]);

  const markets = data?.markets ?? [];
  const unit = data?.unit ?? "₹/qtl";

  const national = useMemo(() => {
    if (!markets.length) return { price: 0, d: 0, w: 0 };
    const p = markets.reduce((a, b) => a + b.price, 0) / markets.length;
    const d = markets.reduce((a, b) => a + b.changeDay, 0) / markets.length;
    const w = markets.reduce((a, b) => a + b.changeWeek, 0) / markets.length;
    return { price: Math.round(p), d, w };
  }, [markets]);

  const movers = useMemo(() => {
    const sorted = [...markets].sort((a, b) => b.changeDay - a.changeDay);
    return { up: sorted.slice(0, 5), down: sorted.slice(-5).reverse() };
  }, [markets]);

  const tickerItems = useMemo(
    () => markets.map((m) => `${commodity} • ${m.market}, ${m.state} • ${fmtIN(m.price)}${unit} `),
    [markets, commodity, unit]
  );

  const ladder = useMemo(() => {
    if (!markets.length) return { farm: 0, mandi: 0, wholesale: 0, retail: 0 };
    const mandi = national.price;
    const farm = Math.round(mandi * 0.92);
    const wholesale = Math.round(mandi * 1.06);
    const retail = Math.round(mandi * 1.15);
    return { farm, mandi, wholesale, retail };
  }, [national, markets.length]);

  const basis = useMemo(() => {
    const spot = national.price;
    const near = data?.futures?.near ?? spot * 0.99;
    const b = Math.round(spot - near);
    const seasonalBand = 180;
    return { b, band: seasonalBand, state: Math.abs(b) > seasonalBand ? "alert" : "ok" };
  }, [national, data?.futures]);

  const tightness = useMemo(() => {
    const d = data?.drivers;
    if (!d) return { score: 50, parts: { arrivals: 0, rainfall: 0, sowing: 0 } };
    const arrivals = Math.max(-30, Math.min(30, -d.arrivalsWoW));
    const rainfall = Math.max(-30, Math.min(30, -d.rainfallAnomaly));
    const sowing = Math.max(-30, Math.min(30, 100 - d.sowingProgress));
    const score = Math.round(50 + arrivals * 0.4 + rainfall * 0.35 + sowing * 0.25);
    return { score: Math.max(0, Math.min(100, score)), parts: { arrivals, rainfall, sowing } };
  }, [data?.drivers]);

  const anomaly = useMemo(() => {
    if (!markets.length) return { count: 0, topGap: 0, pair: "—" };
    const sorted = [...markets].sort((a, b) => a.price - b.price);
    const diff = sorted[sorted.length - 1].price - sorted[0].price;
    const pair = `${sorted[sorted.length - 1].market} vs ${sorted[0].market}`;
    return { count: Math.max(0, Math.round(markets.length / 2)), topGap: diff, pair };
  }, [markets]);

  const forecast = useMemo(() => {
    const series = markets[0]?.series ?? makeSeries(60, 11500, 200);
    const tail = series.slice(-30);
    const avg = tail.reduce((a, b) => a + b.price, 0) / tail.length;
    const std = Math.sqrt(tail.reduce((a, b) => a + Math.pow(b.price - avg, 2), 0) / tail.length);
    const last = tail[tail.length - 1].price;
    const next7 = Array.from({ length: 7 }, (_, i) => ({ date: iso(day(new Date(), i + 1)), price: Math.round(avg + (Math.random() - 0.5) * std * 0.3) }));
    const band = next7.map((p) => ({ date: p.date, lo: Math.round(p.price - std * 0.6), hi: Math.round(p.price + std * 0.6) }));
    return { history: series.slice(-90), next7, band, stats: { mae: Math.round(std * 0.45), mape: +((Math.abs(std / last) * 100).toFixed(1)) } };
  }, [markets]);

  const doubledTicker = [...tickerItems, ...tickerItems];

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <TickerStyles />

      {/* Top Bar */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{t("title")}</h1>
          <p className="mt-1 text-sm text-gray-600">
            {t("investor_mvp")} · {data?.commodity || commodity} · {t("last_updated")} {" "}
         <span className="font-medium text-gray-800" suppressHydrationWarning>
  {fmtTimeIST(data?.updatedAt)}
</span>          </p>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSelector lang={lang} setLang={setLang} />
          <Badge>{t("badge_latency")}</Badge>
          <Badge>{t("badge_markets", markets.length)}</Badge>
        </div>
      </div>

      {/* Why + Turmeric photo side-by-side */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2" title={<TitleWithInfo title={t("why_title")} info={t("why_sub")} />} subtitle={t("why_sub")} right={<Info className="h-4 w-4 text-gray-400" />}>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            <li>{t("why_b1")}</li>
            <li>{t("why_b2")}</li>
            <li>{t("why_b3")}</li>
            <li>{t("why_b4")}</li>
          </ul>
        </Card>
        <Card title="Turmeric (Photo)" subtitle="/images/turmeric.png">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-lg">
            <img src="/images/turmeric.png" alt="Turmeric roots and powder" className="h-full w-full object-cover" />
          </div>
  
        </Card>
      </div>

      {/* Live Ticker */}
      <div className="marquee mt-4 rounded-xl border border-gray-200 bg-white py-2 shadow-sm">
        <div className="marquee__track">
          {doubledTicker.map((tkr, i) => (
            <span key={i} className="mx-3 inline-flex items-center gap-2 text-sm text-gray-700">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" /> {tkr}
            </span>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-2 z-10 mt-4 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
          <div>
            <label className="mb-1 block text-xs text-gray-500">{t("filters_commodity")}</label>
            <select value={commodity} onChange={(e) => setCommodity(e.target.value)} className="w-full rounded-lg border border-gray-300 p-2 text-sm">
              <option>Turmeric</option>
              <option>Chana</option>
              <option>Wheat</option>
              <option>Soybean</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">{t("filters_level")}</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full rounded-lg border border-gray-300 p-2 text-sm">
              <option value="farm">Farm</option>
              <option value="mandi">Mandi</option>
              <option value="wholesale">Wholesale</option>
              <option value="retail">Retail</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">{t("filters_state")}</label>
            <input value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} placeholder="All states" className="w-full rounded-lg border border-gray-300 p-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">{t("filters_variety")}</label>
            <input placeholder="e.g., Finger, Bulb, Grade A" className="w-full rounded-lg border border-gray-300 p-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">{t("filters_unit")}</label>
            <select className="w-full rounded-lg border border-gray-300 p-2 text-sm">
              <option>₹/qtl</option>
              <option>₹/kg</option>
            </select>
          </div>
        </div>
      </div>

      {/* Investor Highlights */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title={<TitleWithInfo title={t("landed_cost")} info={t("i_landed")} />} subtitle={t("landed_sub")} right={<TrendingUp className="h-4 w-4 text-gray-400" />}>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <label className="mb-1 block text-xs text-gray-500">Origin</label>
              <select value={origin} onChange={(e) => setOrigin(e.target.value)} className="w-full rounded-lg border border-gray-300 p-2">
                {markets.map((m) => (
                  <option key={m.market}>{`${m.market}, ${m.state}`}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Destination</label>
              <select value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full rounded-lg border border-gray-300 p-2">
                {markets.map((m) => (
                  <option key={m.market + "-d"}>{`${m.market}, ${m.state}`}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-xs text-gray-500">Freight (₹/qtl)</label>
              <input type="range" min={100} max={1200} step={10} value={freight} onChange={(e) => setFreight(+e.target.value)} className="w-full" />
              <div className="mt-1 text-xs text-gray-600">Freight: <b>₹{fmtIN(freight)}</b>/qtl</div>
            </div>
          </div>
          <hr className="my-3" />
          {(() => {
            const o = markets.find((m) => `${m.market}, ${m.state}` === origin) || markets[0];
            const d = markets.find((m) => `${m.market}, ${m.state}` === destination) || markets[1] || markets[0];
            const delivered = o ? o.price + freight : 0;
            const spread = d ? d.price - delivered : 0;
            return (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500">{t("delivered_cost")}</div>
                  <div className="text-lg font-semibold">{fmtIN(delivered)}{unit} </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">{t("spread_vs_dest")}</div>
                  <div className={`text-lg font-semibold ${spread >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    {spread >= 0 ? <ArrowUpRight className="mr-1 inline h-4 w-4" /> : <ArrowDownRight className="mr-1 inline h-4 w-4" />}
                    {fmtIN(Math.abs(spread))} {unit}
                  </div>
                </div>
              </div>
            );
          })()}
        </Card>

        <Card title={<TitleWithInfo title={t("basis_heatmap")} info={t("i_basis")} />} subtitle={t("basis_sub")} right={<TrendingUp className="h-4 w-4 text-gray-400" />}>
          <div className="flex items-center justify-between text-sm">
            <div>
              <div className="text-xs text-gray-500">National spot (median)</div>
              <div className="text-lg font-semibold">{fmtIN(national.price)}{unit} </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Near futures</div>
              <div className="text-lg font-semibold"> {fmtIN(data?.futures?.near ?? national.price)}{unit} </div>
            </div>
          </div>
          <div className="mt-2 text-sm">Basis: <b> {fmtIN(national.price - (data?.futures?.near ?? national.price))}{unit} </b> · Seasonal band ±{fmtIN(180)}</div>
          <div className="mt-1">{Math.abs(national.price - (data?.futures?.near ?? national.price)) > 180 ? <Badge tone="down">{t("outside_band")}</Badge> : <Badge tone="up">{t("inside_band")}</Badge>}</div>
          <div className="mt-3 h-24 rounded-lg bg-gradient-to-r from-amber-50 via-white to-emerald-50 p-3 text-xs text-gray-500">Heatmap placeholder — wire per‑market basis later.</div>
        </Card>

        <Card title={<TitleWithInfo title={t("nowcast")} info={t("i_nowcast")} />} subtitle={t("nowcast_sub")} right={<TrendingUp className="h-4 w-4 text-gray-400" />}>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <div className="text-3xl font-semibold text-gray-800">{tightness.score}</div>
              <div className="text-xs text-gray-500">{t("loose_tight_hint")}</div>
            </div>
            <div className="flex flex-1 flex-col gap-1 text-xs text-gray-600">
              <div>Arrivals: <b>{pct(tightness.parts.arrivals)}</b></div>
              <div>Rainfall anomaly: <b>{pct(tightness.parts.rainfall)}</b></div>
              <div>Sowing lag: <b>{pct(tightness.parts.sowing)}</b></div>
            </div>
          </div>
        </Card>

        <Card title={<TitleWithInfo title={t("anomaly")} info={t("i_anomaly")} />} subtitle={t("anomaly_sub")} right={<TrendingUp className="h-4 w-4 text-gray-400" />}>
          <div className="text-sm">Anomalies today: <b>{fmtIN(anomaly.count)}</b></div>
          <div className="mt-1 text-sm">Top gap: <b>{fmtIN(anomaly.topGap)}{unit} </b> ({anomaly.pair})</div>
          <div className="mt-3 h-24 rounded-lg bg-gradient-to-r from-rose-50 via-white to-emerald-50 p-3 text-xs text-gray-500">Scatter/links placeholder — compute neighbors & net‑of‑freight later.</div>
        </Card>
      </div>

      {/* Caselet */}
      <Card className="mt-6" title={t("caselet_title")} subtitle={t("caselet_sub")}>
        <ul className="list-disc pl-5 text-sm text-gray-700">
          <li>{t("caselet_b1")}</li>
          <li>{t("caselet_b2")}</li>
          <li>{t("caselet_b3")}</li>
        </ul>
      </Card>

      {/* Today at a Glance */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card title={t("national_price")} subtitle={t("national_sub")}>
          <div className="text-2xl font-semibold"> {fmtIN(national.price)} {unit}  </div>
          <div className="mt-1 text-sm text-gray-600">d/d {pct(national.d)} · w/w {pct(national.w)}</div>
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={markets[0]?.series || []} margin={{ left: 0, right: 0, top: 5, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" hide />
                <YAxis hide domain={["auto", "auto"]} />
                <Tooltip formatter={(v) => [`${fmtIN(v)}${unit} `, "Price"]} />
                <Area dataKey="price" stroke="#22c55e" fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title={t("risers")} subtitle={t("dd_change")}>
          <ul className="space-y-2 text-sm">
            {movers.up.map((m) => (
              <li key={m.market} className="flex items-center justify-between">
                <span>{m.market}, {m.state}</span>
                <span className="font-medium text-emerald-600">{pct(m.changeDay)}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title={t("fallers")} subtitle={t("dd_change")}>
          <ul className="space-y-2 text-sm">
            {movers.down.map((m) => (
              <li key={m.market} className="flex items-center justify-between">
                <span>{m.market}, {m.state}</span>
                <span className="font-medium text-rose-600">{pct(m.changeDay)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Value-chain Ladder header with ⓘ */}
      <div className="mt-6 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800"><TitleWithInfo title={t("value_chain")} info={t("i_ladder")} /></h3>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-4">
        {[ ["Farm", ladder.farm], ["Mandi", ladder.mandi], ["Wholesale", ladder.wholesale], ["Retail", ladder.retail], ].map(([label, val]) => (
          <Card key={label} title={label} subtitle="Today">
            <div className="text-xl font-semibold">{fmtIN(val)} {unit}  </div>
          </Card>
        ))}
      </div>

      {/* Map */}
      <Card className="mt-6" title={t("india_map")} subtitle={t("map_sub")} right={<Map className="h-4 w-4 text-gray-400" />}>
        <div className="h-56 w-full rounded-xl border border-dashed border-gray-300 bg-[repeating-linear-gradient(45deg,_#fafafa,_#fafafa_10px,_#f5f5f5_10px,_#f5f5f5_20px)]" />
        <p className="mt-2 text-xs text-gray-500">Placeholder — plug your choropleth (district/market) here.</p>
      </Card>

      {/* Trend & Seasonality */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card title={t("trend")} subtitle={t("trend_sub")}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={forecast.history} margin={{ top: 10, left: 0, right: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={20} />
              <YAxis tick={{ fontSize: 12 }} width={70} />
              <Tooltip formatter={(v) => [`${fmtIN(v)}${unit} `, "Price"]} />
              <Line type="monotone" dataKey="price" stroke="#0ea5e9" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card title={<TitleWithInfo title={t("seasonality")} info={t("i_seasonality")} />} subtitle={t("seasonality_sub")}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={Array.from({ length: 12 }, (_, i) => ({ month: i + 1, value: 100 + 8 * Math.sin(i / 1.5) }))}>
              <defs>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickFormatter={(m) => ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][m - 1]} />
              <YAxis hide />
              <Tooltip formatter={(v) => [`${v.toFixed(0)}%`, "Seasonality"]} />
              <Area dataKey="value" stroke="#6366f1" fill="url(#g2)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Drivers & Events */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card title={t("arrivals")} subtitle={t("arrivals_sub")}>
          <div className="text-2xl font-semibold">{pct(data?.drivers?.arrivalsWoW ?? 0)}</div>
          <p className="mt-1 text-xs text-gray-500">Lower arrivals typically tighten prices.</p>
        </Card>
        <Card title={t("rainfall")} subtitle={t("rainfall_sub")}>
          <div className="text-2xl font-semibold">{pct(data?.drivers?.rainfallAnomaly ?? 0)}</div>
          <p className="mt-1 text-xs text-gray-500">Negative = deficit rainfall.</p>
        </Card>
        <Card title={t("sowing")} subtitle={t("sowing_sub")}>
          <div className="text-2xl font-semibold">{fmtIN(data?.drivers?.sowingProgress ?? 0, 1)}%</div>
          <p className="mt-1 text-xs text-gray-500">Behind schedule can tighten future supply.</p>
        </Card>
      </div>

      {/* Prediction & Backtest */}
      <Card className="mt-6" title={<TitleWithInfo title={t("prediction")} info={t("i_prediction")} />} subtitle={t("prediction_sub")} right={<TrendingUp className="h-4 w-4 text-gray-400" />}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" allowDataOverflow tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} width={70} />
                <Tooltip />
                <Legend />
                <Line name="Actual" dataKey="price" data={forecast.history} stroke="#0ea5e9" dot={false} />
                <Line name="Forecast" data={forecast.next7} dataKey="price" stroke="#22c55e" dot />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-3 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-900">
              <b>Explainability (mock):</b> arrivals (+0.9%), rainfall (−0.4%), basis (+0.3%) → latest forecast.
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between"><span>MAE (₹/qtl)</span><b>{fmtIN(forecast.stats.mae)}</b></div>
            <div className="flex items-center justify-between"><span>MAPE</span><b>{forecast.stats.mape}%</b></div>
            <div className="flex items-center justify-between"><span>Coverage</span><b>{markets.length} mkts × 150 days</b></div>
            <div className="flex items-center justify-between"><span>Avg band width</span><b>±{fmtIN(Math.round(forecast.stats.mae * 1.2))}</b></div>
            <div className="flex items-center justify-between"><span>Hit-rate (inside band)</span><b>~72% (mock)</b></div>
          </div>
        </div>
      </Card>

      {/* Workflow & Alerts */}
      <Card className="mt-6" title={t("workflow")} subtitle={t("workflow_sub")} right={<Bell className="h-4 w-4 text-gray-400" />}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs text-gray-500">Alert: Basis &gt;</label>
            <input type="number" value={alertBasis} onChange={(e) => setAlertBasis(+e.target.value)} className="w-full rounded-lg border border-gray-300 p-2 text-sm" />
            <p className="mt-2 text-xs text-gray-500">Sends when spot − near futures exceeds threshold.</p>
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">Alert: Spread (farm→mandi) &gt;</label>
            <input type="number" value={alertSpread} onChange={(e) => setAlertSpread(+e.target.value)} className="w-full rounded-lg border border-gray-300 p-2 text-sm" />
            <p className="mt-2 text-xs text-gray-500">Helps monitor procurement margins.</p>
          </div>
          <div className="rounded-lg border border-dashed border-gray-300 p-3 text-sm text-gray-600">
            <div className="text-xs uppercase tracking-wide text-gray-500">{t("preview")}</div>
            <div className="mt-1 rounded-md bg-gray-50 p-2">{t("whatsapp_preview", commodity, unit, fmtIN(basis.b), fmtIN(alertBasis), fmtIN(alertSpread))}</div>
          </div>
        </div>
      </Card>

      {/* Methodology & Data Lineage */}
      <Card className="mt-6" title={t("method")} subtitle={t("method_sub")}>
        <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
          <li>Units normalized to <b>₹/qtl</b> (MVP); outliers clipped at 1st/99th percentiles; gaps filled with neighbor medians.</li>
          <li>Grade normalization via variety tables (to be wired); ladder derived to show farm→mandi→wholesale→retail spreads.</li>
          <li>Per-tile timestamp + coverage counters for <b>auditability</b> and trust.</li>
          <li>Sources (to wire): Agmarknet (mandi), DoCA PMD (retail/wholesale), IMD (rainfall), NCDEX (futures).</li>
        </ul>
      </Card>

      {/* Data Freshness & Coverage */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card title={t("coverage_title")} subtitle={t("coverage_sub")}>
          <div className="text-2xl font-semibold">{markets.length}</div>
          <div className="mt-1 text-xs text-gray-500">Unique markets across states.</div>
        </Card>
        <Card title={t("latency_title")} subtitle={t("latency_sub")}>
          <div className="text-2xl font-semibold">&lt; 30 min</div>
          <div className="mt-1 text-xs text-gray-500">Mocked until real pipelines go live.</div>
        </Card>
        <Card title={t("last_ingest_title")} subtitle={t("last_ingest_sub")}>
          <div className="text-2xl font-semibold">OK</div>
          <div className="mt-1 text-xs text-gray-500">Timestamps per tile above.</div>
        </Card>
      </div>

      {/* Roadmap & GTM */}
      <Card className="mt-6" title={t("roadmap")} subtitle={t("roadmap_sub")}>
        <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
          <li>Next crops: Chana, Wheat, Soybean, Sugar. Global overlays (CBOT/ICE, Pink Sheet).</li>
          <li>Company pages: commodity exposure → sensitivity; hedge planner; API for ERPs.</li>
          <li>Distribution: API, widgets, APMC/FPO/exporter pilots; WhatsApp/Telegram alerts.</li>
        </ul>
      </Card>

      {/* Footer / CTA */}
      <div className="mt-6 flex flex-col items-center gap-2 border-t border-gray-100 pt-6 text-center text-sm text-gray-600">
        <div>
          {t("footer_cta")} <a className="font-medium text-emerald-700 underline" href="/contact">{t("talk_to_us")}</a> · For Demo Purpose
        </div>
        <div className="text-xs text-gray-400">{t("disclaimer")}</div>
      </div>
    </main>
  );
}
