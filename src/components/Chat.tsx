"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { ToolStatus } from "./ai/ToolStatus";
import { RecipeToolResult } from "./ai/RecipeToolResult";
import { Bot } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ToolMessage {
  role: "tool";
  content: string;
  tool: {
    state: "result" | "error";
    data?: unknown;
    error?: string;
  };
}

type ChatEntry = Message | ToolMessage;

interface ToolState {
  state: "streaming" | "running";
  args?: string | string[];
}

const TOOL_MARKER_RE = /<<<([A-Z_]+)>>>/;

export function Chat() {
  const [messages, setMessages] = useState<ChatEntry[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm CookMate AI. Tell me what ingredients you have (e.g. \"I have eggs, tomatoes and cheese\") and I'll find matching recipes from the CookMate library!",
    },
  ]);
  const [streamingContent, setStreamingContent] = useState("");
  const [toolState, setToolState] = useState<ToolState | null>(null);
  const [loading, setLoading] = useState(false);
  const [manualScroll, setManualScroll] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (!manualScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [manualScroll]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, toolState, scrollToBottom]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setManualScroll(!isNearBottom);
  };

  const handleStop = () => {
    abortRef.current?.abort();
    if (streamingContent) {
      setMessages((prev) => [...prev, { role: "assistant", content: streamingContent }]);
    }
    setStreamingContent("");
    setToolState(null);
    setLoading(false);
  };

  const handleToolEvent = (type: string, payload: string) => {
    if (type === "TOOL_STREAM") {
      setToolState({ state: "streaming", args: payload });
    } else if (type === "TOOL_RUN") {
      let args: string[] = [];
      try {
        const parsed = JSON.parse(payload);
        if (Array.isArray(parsed.ingredients)) args = parsed.ingredients;
      } catch {}
      setToolState({ state: "running", args });
    } else if (type === "TOOL_RESULT") {
      let data: unknown = null;
      try {
        data = JSON.parse(payload);
      } catch {}
      setMessages((prev) => [...prev, { role: "tool", content: "", tool: { state: "result", data } }]);
      setToolState(null);
    } else if (type === "TOOL_ERROR") {
      let error = "Something went wrong while searching recipes.";
      try {
        const parsed = JSON.parse(payload);
        if (parsed.message) error = parsed.message;
      } catch {}
      setMessages((prev) => [...prev, { role: "tool", content: "", tool: { state: "error", error } }]);
      setToolState(null);
    }
  };

  const parseIncoming = (raw: string) => {
    let remaining = raw;
    while (remaining.length > 0) {
      const match = remaining.match(TOOL_MARKER_RE);
      if (!match) {
        setStreamingContent((prev) => prev + remaining);
        return;
      }
      const before = remaining.slice(0, match.index);
      if (before) setStreamingContent((prev) => prev + before);

      const rest = remaining.slice((match.index ?? 0) + match[0].length);
      const next = rest.match(TOOL_MARKER_RE);
      const payload = next ? rest.slice(0, next.index) : rest;
      handleToolEvent(match[1], payload);
      remaining = next ? rest.slice(next.index ?? 0) : "";
    }
  };

  const handleSend = async (content: string) => {
    const userMessage: Message = { role: "user", content };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setLoading(true);
    setStreamingContent("");
    setToolState(null);
    setManualScroll(false);

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated
            .filter((m) => m.role !== "tool")
            .map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        let errMsg = "Sorry, I ran into an issue. Please try again.";
        try {
          const err = await res.json();
          if (err.error) errMsg = `Error: ${err.error}`;
        } catch {}
        throw new Error(errMsg);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        accumulated += text;
        parseIncoming(text);
      }

      const cleanText = accumulated.replace(/<<<[A-Z_]+>>>[^<]*/g, "").trim();
      if (cleanText) {
        setMessages((prev) => [...prev, { role: "assistant", content: cleanText }]);
      }
    } catch (e: unknown) {
      if (e instanceof Error && e.name === "AbortError") return;
      const errMsg = e instanceof Error ? e.message : "Sorry, I ran into an issue. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: errMsg }]);
    } finally {
      setStreamingContent("");
      setToolState(null);
      setLoading(false);
      abortRef.current = null;
    }
  };

  const handleRetry = () => {
    const lastUser = [...messages].reverse().find((m): m is Message => m.role === "user");
    if (lastUser) handleSend(lastUser.content);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <Bot className="h-5 w-5 text-orange-500" />
        <span className="text-sm font-semibold text-zinc-900 dark:text-white">CookMate AI</span>
      </div>

      <div ref={containerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto py-4">
        <div className="mx-auto max-w-3xl">
          {messages.map((msg, i) => {
            if (msg.role === "tool") {
              if (msg.tool.state === "result") {
                return <RecipeToolResult key={i} data={msg.tool.data} />;
              }
              return (
                <ToolStatus
                  key={i}
                  status="error"
                  error={msg.tool.error}
                  onRetry={handleRetry}
                />
              );
            }
            return <ChatMessage key={i} role={msg.role} content={msg.content} />;
          })}
          {toolState?.state === "streaming" && <ToolStatus status="streaming" args={toolState.args} />}
          {toolState?.state === "running" && <ToolStatus status="running" args={toolState.args} />}
          {streamingContent && <ChatMessage role="assistant" content={streamingContent} />}
          {loading && !streamingContent && !toolState && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      </div>

      <ChatInput onSend={handleSend} onStop={handleStop} loading={loading} />
    </div>
  );
}
