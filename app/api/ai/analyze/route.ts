import { NextResponse } from "next/server";
import Groq from "groq-sdk";

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;

  // Prevent crash during Docker build; only crash during runtime if needed
  if (!apiKey) {
    throw new Error("GROQ_API_KEY missing at runtime");
  }

  return new Groq({ apiKey });
}

export async function POST(req: Request) {
  try {
    const client = getGroqClient();

    const { action, log } = await req.json();
    const message = log?.Message || "No log message";

    const prompts: Record<string, string> = {
      why_benign: "Give a short 2–3 sentence explanation of why this Sysmon event is benign.",
      when_malicious: "Give a short 2–3 sentence explanation of in what situation this benign Sysmon event might become malicious.",
      why_malicious: "Give a short 2–3 sentence explanation of why this Sysmon event is malicious.",
      user_action: "Give a short 2–3 sentence recommended action for the user for this Sysmon event."
    };

    const instruction = prompts[action] || "Give a short explanation.";

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are a SOC analyst assistant.
Always respond in 2–3 concise sentences.
Do NOT include headers, bullet points, or event metadata.
Do NOT restate the entire log.
Only give the explanation directly.
          `,
        },
        {
          role: "user",
          content: `${instruction}\n\nLog:\n${message}`,
        },
      ],
      temperature: 0.2,
    });

    return NextResponse.json({
      result: completion.choices?.[0]?.message?.content || "No output",
    });
  } catch (err: any) {
    console.error("AI error:", err);
    return NextResponse.json(
      { error: "AI processing failed" },
      { status: 500 }
    );
  }
}
