import { useState, useEffect } from "react";

export default function IntentSearchDemo() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearched(true);
    setSuggestions([]);
    const res = await fetch("/api/intent-search/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ site_id: "11111111-2222-4333-8444-555555555555", q }),
    }).then((r) => r.json());
    setResults(res.items || []);
  }

  async function fetchSuggestions(value: string) {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }
    const res = await fetch(
      `/api/intent-search/suggest?site_id=11111111-2222-4333-8444-555555555555&q=${encodeURIComponent(
        value
      )}`
    ).then((r) => r.json());
    setSuggestions(res.suggestions || []);
  }

  useEffect(() => {
    const timeout = setTimeout(() => fetchSuggestions(q), 200);
    return () => clearTimeout(timeout);
  }, [q]);

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-50 pt-32">
      <div className="w-full max-w-xl text-center relative">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row items-center sm:items-stretch"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="border px-4 py-3 w-full sm:w-3/4 rounded-lg shadow-sm focus:outline-none"
            placeholder="Search products..."
          />
          <button
            type="submit"
            className="mt-2 sm:mt-0 sm:ml-2 px-5 py-3 bg-blue-600 text-white rounded-lg w-full sm:w-auto"
          >
            Search
          </button>
        </form>

        {suggestions.length > 0 && (
          <div className="absolute bg-white shadow-md rounded-md mt-2 text-left w-full z-10">
            {suggestions.map((s: any) => (
              <div
                key={s.id}
                onClick={() => {
                  setQ(s.title);
                  setSuggestions([]);
                }}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {s.title}
              </div>
            ))}
          </div>
        )}

        {searched && results.length === 0 && (
          <p className="text-gray-500 mt-6">No results found.</p>
        )}

        <div className="mt-6 text-left">
          {results.map((r) => (
            <div
              key={r.id}
              className="border rounded-lg p-4 mb-2 shadow-sm bg-white"
            >
              <strong>{r.title}</strong>
              <div className="text-sm text-gray-600">
                {r.price_cents / 100} {r.currency}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
