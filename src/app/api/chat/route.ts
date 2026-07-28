import { NextRequest } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
const MODEL = "openai/gpt-4o-mini";

export async function POST(req: NextRequest) {
  try {
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY is not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { messages } = await req.json();

    const systemMessage = {
      role: "system",
      content:
        "You are CookMate AI, a helpful recipe assistant integrated into the CookMate recipe platform. Help users find recipes based on ingredients they have, suggest modifications to existing recipes, answer cooking technique questions, provide nutritional advice, convert serving sizes, and suggest meal plans. Keep responses concise, practical, and focused on cooking. Be encouraging and make cooking feel accessible. If asked about non-food topics, politely redirect back to cooking.",
    };

    const openRouterMessages = [
      systemMessage,
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: openRouterMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      let errMsg = `API error ${response.status}`;
      try {
        const parsed = JSON.parse(errBody);
        errMsg = parsed.error?.message || parsed.error || errMsg;
      } catch {}
      return new Response(JSON.stringify({ error: errMsg }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data: ")) continue;
              const data = trimmed.slice(6);
              if (data === "[DONE]") continue;
              if (!data) continue;

              try {
                const parsed = JSON.parse(data);
                const text = parsed.choices?.[0]?.delta?.content;
                if (text) controller.enqueue(encoder.encode(text));
              } catch {}
            }
          }
        } catch (e) {
          const errText = e instanceof Error ? e.message : "I encountered an error. Please try again.";
          try { controller.enqueue(encoder.encode("\n\n" + errText)); } catch {}
        } finally {
          try { controller.close(); } catch {}
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}