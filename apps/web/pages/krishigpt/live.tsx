"use client";

import { useEffect, useRef, useState } from "react";



// Supported languages
const LANGS = [
  { key: "en", label: "English" },
  { key: "hi", label: "हिंदी" },
  { key: "mr", label: "मराठी" },
] as const;

type LangKey = (typeof LANGS)[number]["key"];
type ChatMessage = { role: "user" | "assistant"; content: string };

// UI translations
const TEXTS: Record<LangKey, any> = {
  en: {
    title: "🌱 KrishiGPT — India’s Agriculture Guide",
    definition:
      "KrishiGPT is your multilingual, safe, and farmer-friendly AI advisor. Get instant help on crops, cattle, fisheries, mushrooms, hydroponics, mandi prices, schemes, and more. Always practical. Always label-safe.",
    suggestions: [
      "🌱 Will it rain tomorrow for my cotton spray?",
      "🐄 My cow is not eating due to heat — what to do?",
      "☁️ PM-KISAN money not credited — who to contact?",
      "🍄 Mushrooms are browning — how to fix?",
    ],
    inputPlaceholder: "Ask about crops, cattle, fisheries, weather, PM-KISAN…",
    micTip: "Speak your question",
    send: "Send",
  },
  hi: {
    title: "🌱 KrishiGPT — भारत का कृषि मार्गदर्शक",
    definition:
      "KrishiGPT आपका बहुभाषी, सुरक्षित और किसान-हितैषी एआई सलाहकार है। फसल, पशुधन, मत्स्य, मशरूम, हाइड्रोपोनिक्स, मंडी भाव, योजनाएँ और अधिक पर तुरंत मदद पाएं। हमेशा व्यावहारिक। हमेशा सुरक्षित।",
    suggestions: [
      "🌱 क्या कल कपास पर छिड़काव के समय बारिश होगी?",
      "🐄 मेरी गाय गर्मी से नहीं खा रही — क्या करें?",
      "☁️ पीएम-किसान का पैसा नहीं आया — किससे संपर्क करें?",
      "🍄 मशरूम भूरे हो रहे हैं — क्या उपाय करें?",
    ],
    inputPlaceholder: "फसल, पशु, मत्स्य, मौसम, पीएम-किसान… पूछें",
    micTip: "अपना प्रश्न बोलें",
    send: "भेजें",
  },
  mr: {
    title: "🌱 KrishiGPT — भारताचे कृषी मार्गदर्शक",
    definition:
      "KrishiGPT हा तुमचा बहुभाषिक, सुरक्षित आणि शेतकरी-हितकारी एआय सल्लागार आहे. पिके, जनावरे, मत्स्य, मशरूम, हायड्रोपोनिक्स, बाजारभाव, योजना यावर त्वरित मदत मिळवा. नेहमी व्यावहारिक. नेहमी सुरक्षित.",
    suggestions: [
      "🌱 उद्या कापूस फवारणीला पाऊस पडेल का?",
      "🐄 उष्णतेमुळे माझी गाय खात नाही — काय करावे?",
      "☁️ पीएम-किसान पैसे जमा झाले नाहीत — कोणाशी संपर्क करावा?",
      "🍄 मशरूम तपकिरी होत आहेत — काय उपाय?",
    ],
    inputPlaceholder: "पिके, जनावरे, मत्स्य, हवामान, पीएम-किसान… विचारा",
    micTip: "आपला प्रश्न बोला",
    send: "पाठवा",
  },
};

export default function KrishiGPTApp() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [lang, setLang] = useState<LangKey>("en");
  const [loading, setLoading] = useState(false);
    const [started, setStarted] = useState(false); // 👈 new state
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Handle sending message
  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim() || loading) return;

     if (!started) setStarted(true); // 👈 mark chat started

    const base = [...messages, { role: "user" as const, content: input }];
    setMessages(base);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch("/api/krishigpt/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, lang }),
      });

      if (!resp.body) {
        const txt = await resp.text();
        setMessages([...base, { role: "assistant", content: txt }]);
        setLoading(false);
        return;
      }

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();

      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value || new Uint8Array(), { stream: !done });
        if (chunk) {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (!last || last.role !== "assistant") return prev;
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", content: last.content + chunk };
            return updated;
          });
        }
      }
    } finally {
      setLoading(false);
    }
  }

  // Voice input
  function startVoiceInput() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech recognition not supported");

    const recognition = new SpeechRecognition();
    recognition.lang = lang === "en" ? "en-IN" : "hi-IN";
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
    recognitionRef.current = recognition;
  }

  return (
    
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Title after first message */}
{started && (
  <h2 className="text-lg font-semibold text-gray-700 mb-3">
    {TEXTS[lang].title}
  </h2>
)}
      
      {/* Language toggle */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {LANGS.map((l) => (
          <button
            key={l.key}
            onClick={() => setLang(l.key)}
            className={`rounded-full px-3 py-1 text-xs ring-1 ${
              lang === l.key ? "bg-emerald-600 text-white ring-emerald-600" : "bg-white text-gray-700 ring-gray-300"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Chat box */}
 <div className="w-full bg-white shadow-md overflow-y-auto mb-4 h-[70vh] md:h-[70vh] md:max-w-6xl md:rounded-lg md:p-6 rounded-none px-4 py-4">
       {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
            <div className="text-5xl mb-4">🌱</div>
            <h2 className="text-xl font-semibold">{TEXTS[lang].title}</h2>
            <p className="mt-2 max-w-md text-sm">{TEXTS[lang].definition}</p>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {TEXTS[lang].suggestions.map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`mb-3 ${m.role === "user" ? "text-right" : "text-left"}`}>
              <div
                className={`inline-block px-4 py-3 rounded-lg text-sm whitespace-pre-line ${
                  m.role === "user" ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-800"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))
        )}
        {loading && <div className="text-gray-400 text-sm">Thinking…</div>}
      </div>

      {/* Input bar */}
     <form
  onSubmit={sendMessage}
  className="flex w-full md:max-w-6xl border border-gray-300 rounded-lg overflow-hidden"
>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          className="flex-1 border-none px-3 py-3 focus:outline-none"
          placeholder={TEXTS[lang].inputPlaceholder}
        />
        <button
          type="button"
          onClick={startVoiceInput}
          className="bg-gray-100 px-4 py-3 border-l border-gray-300"
          title={TEXTS[lang].micTip}
        >
          🎤
        </button>
        <button
  type="submit"
  disabled={loading}
  className="bg-emerald-600 text-white px-9 py-2 font-semibold hover:bg-emerald-700 disabled:opacity-60"
>
  {TEXTS[lang].send}
</button>

      </form>
    </div>
  );
}
