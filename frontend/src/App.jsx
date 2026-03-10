import { useState } from "react"
import axios from "axios"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts"

export default function App() {

  const [query, setQuery] = useState("")
  const [chart, setChart] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const askAI = async () => {

    if (!query.trim()) return

    setLoading(true)
    setChart(null)
    setError(null)

    try {

      const res = await axios.post("http://localhost:5000/query", {
        query: query
      })

      if (res.data.error) {
        setError(res.data.error)
      } else {
        setChart(res.data)
      }

    } catch (err) {
      console.error(err)
      setError("Server error. Please try again.")
    }

    setLoading(false)
  }

  const examples = [
    "show revenue by region",
    "total quantity sold by product category",
    "monthly revenue trend"
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* NAV */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-bold text-gray-900">Dashify</span>
          <div className="flex gap-5 text-sm text-gray-500">
            <span>Docs</span>
            <span>Pricing</span>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-12">

          <h1 className="text-3xl font-bold mb-2">Business Dashboard</h1>
          <p className="text-gray-500 mb-8">
            Ask a question about your data
          </p>

          {/* INPUT */}
          <div className="flex gap-2 mb-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && askAI()}
              placeholder="e.g. show revenue by region"
              className="flex-1 border rounded-lg px-4 py-2"
            />

            <button
              onClick={askAI}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              {loading ? "Thinking..." : "Ask"}
            </button>
          </div>

          {/* EXAMPLE QUERIES */}
          <div className="flex flex-wrap gap-2 mb-8">
            {examples.map((q, i) => (
              <button
                key={i}
                onClick={() => setQuery(q)}
                className="text-xs border px-3 py-1 rounded-full"
              >
                {q}
              </button>
            ))}
          </div>

          {/* ERROR */}
          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded mb-6 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* CHART */}
          {chart && (
            <div className="bg-white border rounded-xl p-6">

              <h2 className="font-semibold mb-6">
                {chart.title}
              </h2>

              <div style={{ height: 320 }}>

                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chart.data}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey={chart.xAxis} />

                    <YAxis />

                    <Tooltip />

                    <Bar
                      dataKey={chart.yAxis}
                      fill="#2563eb"
                    />

                  </BarChart>
                </ResponsiveContainer>

              </div>

            </div>
          )}

          {/* LOADING */}
          {loading && (
            <div className="text-gray-500 text-sm">
              Generating dashboard...
            </div>
          )}

          {/* EMPTY */}
          {!chart && !loading && !error && (
            <div className="border-2 border-dashed rounded-xl p-12 text-center text-gray-400">
              Your chart will appear here
            </div>
          )}

        </div>
      </main>

    </div>
  )
}