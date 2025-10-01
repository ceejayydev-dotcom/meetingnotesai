"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabaseClient";

type SummaryRecord = {
  id: string;
  text: string;
  summary: string;
  created_at: string;
};

export default function HomePage() {
  const { user, loading } = useAuth();
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [pastSummaries, setPastSummaries] = useState<SummaryRecord[]>([]);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Fetch previous summaries after login
  useEffect(() => {
    if (user) {
      supabase
        .from("summaries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          if (data) setPastSummaries(data);
        });
    }
  }, [user]);

  const handleSummarize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in first!");
      return;
    }

    setIsSummarizing(true);
    setSummary("");

    const res = await fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: inputText, userId: user.id }),
    });

    const data = await res.json();
    setSummary(data.summary);
    setIsSummarizing(false);

    // Refresh list
    const { data: refreshed } = await supabase
      .from("summaries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (refreshed) setPastSummaries(refreshed);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Welcome to Meeting Notes AI</h1>
        <a
          href="/login"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Login to continue
        </a>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">🧠 Meeting Notes AI</h1>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>

        <form onSubmit={handleSummarize} className="flex flex-col gap-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your meeting notes here..."
            className="border p-3 rounded-lg h-40"
            required
          ></textarea>
          <button
            type="submit"
            disabled={isSummarizing}
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSummarizing ? "Summarizing..." : "Summarize & Save"}
          </button>
        </form>

        {summary && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">📝 New Summary</h2>
            <p className="bg-gray-50 border p-3 rounded-lg whitespace-pre-line">
              {summary}
            </p>
          </div>
        )}

        {pastSummaries.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-3">📚 Previous Summaries</h2>
            <ul className="space-y-3">
              {pastSummaries.map((item) => (
                <li
                  key={item.id}
                  className="border p-3 rounded-lg bg-gray-50 overflow-hidden"
                >
                  <p className="text-gray-800 mb-2">{item.summary}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
