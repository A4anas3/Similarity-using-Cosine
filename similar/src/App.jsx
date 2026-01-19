import { useState } from "react";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/search?query=${encodeURIComponent(query)}`,
        { method: "POST" },
      );

      const data = await res.json();
      console.log("API RESPONSE:", data);
      setResults(data.results || []);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-black p-6">
      <div className="w-full max-w-2xl rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-6">
        <h1 className="text-3xl font-bold text-center text-indigo-300 mb-6">
          🔍 Semantic Search
        </h1>

        {/* Search box */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Search anything…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 rounded-xl bg-slate-800 text-white px-4 py-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </div>

        {/* Results */}
        <div className="space-y-3">
          {results.map((item, index) => (
            <div
              key={item.id}
              className="rounded-xl bg-slate-800/70 border border-slate-700 p-4 flex justify-between items-center"
            >
              <span className="text-indigo-300 font-semibold">
                #{index + 1} • ID: {item.id}
              </span>
              <span className="text-green-400 font-mono">
                Score: {item.score}
              </span>
            </div>
          ))}

          {!loading && query && results.length === 0 && (
            <p className="text-center text-slate-400">
              No close matches found. Try a longer query.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
