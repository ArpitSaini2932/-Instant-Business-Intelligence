import { useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer
} from "recharts"

const mockFetch = async (query) => {
  await new Promise(r => setTimeout(r, 900))
  return {
    title: query,
    xAxis: "label",
    yAxis: "value",
    data: [
      { label: "North", value: 42000 },
      { label: "South", value: 31000 },
      { label: "East", value: 58000 },
      { label: "West", value: 47000 },
      { label: "Central", value: 36000 },
    ]
  }
}

export default function App() {
  const [query, setQuery] = useState("")
  const [chart, setChart] = useState(null)
  const [loading, setLoading] = useState(false)

  const askAI = async () => {
    if (!query.trim()) return
    setLoading(true)
    setChart(null)
    try {
      const data = await mockFetch(query)
      setChart(data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const examples = [
    "Show revenue by region",
    "Total quantity sold by category",
    "Monthly revenue trend",
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ fontFamily: "'Trebuchet MS', sans-serif" }}>

      {/* Nav */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-bold text-gray-900 text-base tracking-tight">Dashify</span>
          <div className="flex items-center gap-5">
            <a href="#" className="text-xs text-gray-500 hover:text-gray-800 transition">Docs</a>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-800 transition">Pricing</a>
            <a href="#" className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition px-3 py-1.5 rounded-md">Sign up</a>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-12">

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Business Dashboard</h1>
            <p className="text-gray-500 text-sm">Ask a question about your data to generate a chart.</p>
          </div>

          {/* Input */}
          <div className="flex gap-2 mb-4">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && askAI()}
              placeholder="e.g. show revenue by region"
              className="flex-1 px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition text-gray-800 placeholder-gray-400"
            />
            <button
              onClick={askAI}
              disabled={loading || !query.trim()}
              className="px-5 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg transition"
            >
              {loading ? "Loading…" : "Ask"}
            </button>
          </div>

          {/* Example queries */}
          <div className="flex flex-wrap gap-2 mb-10">
            {examples.map((q, i) => (
              <button
                key={i}
                onClick={() => setQuery(q)}
                className="px-3 py-1.5 text-xs text-gray-500 bg-white border border-gray-200 rounded-full hover:border-gray-400 hover:text-gray-700 transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chart card */}
          {chart && !loading && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Result</p>
              <h2 className="text-base font-semibold text-gray-800 mb-6 capitalize">{chart.title}</h2>
              <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chart.data} barCategoryGap="40%">
                    <CartesianGrid vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey={chart.xAxis} tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${v / 1000}k` : v} />
                    <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} cursor={{ fill: "#f9fafb" }} />
                    <Bar dataKey={chart.yAxis} fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-sm text-gray-400">
              Generating chart…
            </div>
          )}

          {/* Empty */}
          {!chart && !loading && (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-16 text-center text-sm text-gray-400">
              Your chart will appear here
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-6 h-12 flex items-center justify-between">
          <span className="text-xs text-gray-400">© 2025 Dashify</span>
          <div className="flex gap-5">
            <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition">Privacy</a>
            <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition">Terms</a>
            <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  )
}