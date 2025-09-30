import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { text, userId } = await req.json();

  const hfToken = process.env.HF_TOKEN;
  if (!hfToken) {
    return NextResponse.json({ error: "Missing HF_TOKEN" }, { status: 500 });
  }

  const response = await fetch(
    "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
    {
      headers: {
        Authorization: `Bearer ${hfToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs: text }),
    }
  );

  const data = await response.json();
  const summary = data[0]?.summary_text || "No summary generated.";

  // Save to Supabase
  const { error } = await supabase
    .from("summaries")
    .insert([{ user_id: userId, text, summary }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ summary });
}
