import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { text } = await req.json();

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await response.json();
  const summary: string = data[0]?.summary_text || "No summary generated.";

  return NextResponse.json({ summary });
}
