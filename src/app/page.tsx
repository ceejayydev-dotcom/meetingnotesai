"use client";

import { useState } from "react";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSummary("");

    const res = await fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: inputText }),
    });

    const data = await res.json();
    setSummary(data.summary);
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      <div className="max-w-2xl w-full bg-white p-6 rounded-2xl shadow">
        <h1 className="text-3xl font-bold text-center mb-4">
          🧠 Meeting Notes AI Summarizer
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your text here..."
            className="border p-3 rounded-lg h-40"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Summarizing..." : "Summarize"}
          </button>
        </form>

        {summary && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">📝 Summary</h2>
            <p className="bg-gray-50 border p-3 rounded-lg whitespace-pre-line">
              {summary}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
