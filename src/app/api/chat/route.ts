import { NextRequest } from "next/server";
import { searchRecipes, searchRecipesSchema } from "@/lib/tools/searchRecipes";

const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;
const MODEL = "openai/gpt-4o-mini";
const MAX_TOOL_ROUNDS = 3;

const SYSTEM_PROMPT = `You are CookMate AI, a helpful recipe assistant integrated into the CookMate recipe platform.

Your role:
- Help users find recipes based on ingredients they have
- Suggest modifications to existing recipes
- Answer cooking technique questions
- Provide nutritional advice
- Convert recipe serving sizes
- Suggest meal plans

Whenever a user mentions ingredients they have on hand and wants to know what to cook, ALWAYS use the searchRecipes tool instead of inventing recipes. After the tool returns results, summarize the best matches briefly and mention the match percentages. If the tool returns an empty list, tell the user no recipes matched and suggest alternatives.

Keep responses concise, practical, and focused on cooking. If asked about non-food topics, politely redirect back to cooking.`;

const TOOLS = [
  {
    type: "function",
    function: {
      name: "searchRecipes",
      description:
        "Search CookMate's recipe database for recipes that match the ingredients the user has on hand. Returns recipes ranked by ingredient match score, with cooking time, difficulty, and rating.",
      parameters: {
        type: "object",
        properties: {
          ingredients: {
            type: "array",
            items: { type: "string" },
            description: "List of ingredients the user has available",
          },
        },
        required: ["ingredients"],
        additionalProperties: false,
      },
    },
  },
];

const MARKERS = {
  TOOL_STREAM: "<<<TOOL_STREAM>>>",
  TOOL_RUN: "<<<TOOL_RUN>>>",
  TOOL_RESULT: "<<<TOOL_RESULT>>>",
  TOOL_ERROR: "<<<TOOL_ERROR>>>",
};

interface ToolCallAccumulator {
  id: string;
  name: string;
  arguments: string;
}

async function streamChat(
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  messages: { role: string; content: string | null; tool_calls?: unknown[] }[]
) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      tools: TOOLS,
      tool_choice: "auto",
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
    throw new Error(errMsg);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";
  const toolCalls: ToolCallAccumulator[] = [];

  const flush = () => {
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data: ")) continue;
      const data = trimmed.slice(6);
      if (!data || data === "[DONE]") continue;

      let parsed;
      try {
        parsed = JSON.parse(data);
      } catch {
        continue;
      }

      const delta = parsed.choices?.[0]?.delta;
      if (!delta) continue;

      if (delta.content) {
        text += delta.content;
        controller.enqueue(encoder.encode(delta.content));
      }

      for (const tc of delta.tool_calls ?? []) {
        const idx = tc.index ?? 0;
        toolCalls[idx] = toolCalls[idx] ?? { id: "", name: "", arguments: "" };
        if (tc.id) toolCalls[idx].id = tc.id;
        if (tc.function?.name) toolCalls[idx].name = tc.function.name;
        if (tc.function?.arguments) {
          toolCalls[idx].arguments += tc.function.arguments;
          controller.enqueue(encoder.encode(`${MARKERS.TOOL_STREAM}${toolCalls[idx].arguments}`));
        }
      }
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    flush();
  }

  return { text, toolCalls: toolCalls.filter((c) => c.id && c.name) };
}

export async function POST(req: NextRequest) {
  try {
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key is not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { messages } = await req.json();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          let conversation = [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.map((m: { role: string; content: string }) => ({
              role: m.role === "assistant" ? "assistant" : "user",
              content: m.content,
            })),
          ];

          for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
            const { text, toolCalls } = await streamChat(controller, encoder, conversation);

            if (toolCalls.length === 0) break;

            conversation.push({
              role: "assistant",
              content: text || null,
              tool_calls: toolCalls.map((call) => ({
                id: call.id,
                type: "function",
                function: { name: call.name, arguments: call.arguments },
              })),
            });

            for (const call of toolCalls) {
              let result: unknown;
              try {
                const parsed = searchRecipesSchema.parse(JSON.parse(call.arguments));
                controller.enqueue(encoder.encode(`${MARKERS.TOOL_RUN}${JSON.stringify(parsed)}`));
                const data = searchRecipes(parsed);
                controller.enqueue(encoder.encode(`${MARKERS.TOOL_RESULT}${JSON.stringify(data)}`));
                result = { ok: true, data };
              } catch (e) {
                const issues =
                  e && typeof e === "object" && "issues" in e
                    ? (e as { issues: { message: string }[] }).issues.map((i) => i.message).join("; ")
                    : "";
                const errMsg =
                  issues ||
                  (e instanceof Error ? e.message : "Invalid tool input. Please try again.");
                controller.enqueue(encoder.encode(`${MARKERS.TOOL_ERROR}${JSON.stringify({ message: errMsg })}`));
                result = { ok: false, error: errMsg };
              }

              conversation.push({
                role: "tool",
                tool_call_id: call.id,
                content: JSON.stringify(result),
              });
            }
          }
        } catch (e) {
          const errText = e instanceof Error ? e.message : "I encountered an error. Please try again.";
          try { controller.enqueue(encoder.encode(`\n\n${errText}`)); } catch {}
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
