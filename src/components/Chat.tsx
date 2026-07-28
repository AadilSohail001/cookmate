"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { Bot } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm CookMate AI. Tell me what ingredients you have or what kind of recipe you're looking for, and I'll help you cook something delicious!",
    },
  ]);
  const [streamingContent, setStreamingContent] = useState("");
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
  }, [messages, streamingContent, scrollToBottom]);

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
    setLoading(false);
  };

  const handleSend = async (content: string) => {
    const userMessage: Message = { role: "user", content };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setLoading(true);
    setStreamingContent("");
    setManualScroll(false);

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated.map((m) => ({ role: m.role, content: m.content })),
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
        setStreamingContent(accumulated);
      }

      setMessages((prev) => [...prev, { role: "assistant", content: accumulated }]);
    } catch (e: unknown) {
      if (e instanceof Error && e.name === "AbortError") return;
      const errMsg = e instanceof Error ? e.message : "Sorry, I ran into an issue. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: errMsg }]);
    } finally {
      setStreamingContent("");
      setLoading(false);
      abortRef.current = null;
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <Bot className="h-5 w-5 text-orange-500" />
        <span className="text-sm font-semibold text-zinc-900 dark:text-white">CookMate AI</span>
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto py-4"
      >
        <div className="mx-auto max-w-3xl">
          {messages.map((msg, i) => (
            <ChatMessage key={i} role={msg.role} content={msg.content} />
          ))}
          {loading && !streamingContent && <TypingIndicator />}
          {streamingContent && (
            <ChatMessage role="assistant" content={streamingContent} />
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <ChatInput onSend={handleSend} onStop={handleStop} loading={loading} />
    </div>
  );
}