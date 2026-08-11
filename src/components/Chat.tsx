"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { ToolStatus } from "./ai/ToolStatus";
import { RecipeToolResult } from "./ai/RecipeToolResult";
import { ErrorNotice } from "./ai/ErrorNotice";
import { WelcomeState } from "./ai/WelcomeState";
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

type ErrorKind = "network" | "rate_limit" | "interrupted" | "api" | "unknown";

interface ChatError {
  kind: ErrorKind;
  detail?: string;
}

const END_MARKER = "<<<END>>>";

export function Chat() {
  const [messages, setMessages] = useState<ChatEntry[]>([]);
  const [streamingContent, setStreamingContent] = useState("");
  const [toolState, setToolState] = useState<ToolState | null>(null);
  const [loading, setLoading] = useState(false);
  const [chatError, setChatError] = useState<ChatError | null>(null);
  const [partial, setPartial] = useState<string | null>(null);
  const [manualScroll, setManualScroll] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const streamingRef = useRef("");
  const pendingBufferRef = useRef("");

  const appendText = (text: string) => {
    streamingRef.current += text;
    setStreamingContent(streamingRef.current);
  };

  const clearText = () => {
    streamingRef.current = "";
    setStreamingContent("");
  };

  const flushPendingText = () => {
    const text = streamingRef.current.trim();
    clearText();
    if (text) {
      setMessages((prev) => [...prev, { role: "assistant", content: text }]);
    }
  };

  const scrollToBottom = useCallback(() => {
    if (!manualScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [manualScroll]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, toolState, chatError, partial, scrollToBottom]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setManualScroll(!isNearBottom);
  };

  const handleToolEvent = (type: string, payload: string) => {
    if (type === "TOOL_STREAM") {
      flushPendingText();
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

  // Process streamed raw text, handling markers that may span chunk boundaries.
  const parseIncoming = (raw: string) => {
    let buffer = pendingBufferRef.current + raw;
    pendingBufferRef.current = "";
    let scan = 0;

    while (true) {
      const markerIdx = buffer.indexOf("<<<", scan);
      if (markerIdx === -1) {
        const tail = buffer.slice(scan);
        if (!tail) return;
        let keep = 0;
        for (let i = tail.length - 1; i >= 0 && tail[i] === "<" && keep < 2; i--) keep++;
        const flushLen = tail.length - keep;
        if (flushLen > 0) appendText(tail.slice(0, flushLen));
        pendingBufferRef.current = keep > 0 ? tail.slice(flushLen) : "";
        return;
      }

      const text = buffer.slice(scan, markerIdx);
      if (text) appendText(text);

      const markerEnd = buffer.indexOf(">>>", markerIdx + 3);
      if (markerEnd === -1) {
        pendingBufferRef.current = buffer.slice(markerIdx);
        return;
      }

      const type = buffer.slice(markerIdx + 3, markerEnd);
      if (type === "END") {
        scan = markerEnd + 3;
        continue;
      }

      const endIdx = buffer.indexOf(END_MARKER, markerEnd + 3);
      if (endIdx === -1) {
        pendingBufferRef.current = buffer.slice(markerIdx);
        return;
      }

      const payload = buffer.slice(markerEnd + 3, endIdx);
      handleToolEvent(type, payload);
      scan = endIdx + END_MARKER.length;
      if (scan >= buffer.length) {
        pendingBufferRef.current = "";
        return;
      }
    }
  };

  // Dispatch the final segment left in the buffer (stream ended mid-payload).
  const drainBuffer = () => {
    let buffer = pendingBufferRef.current;
    pendingBufferRef.current = "";
    if (!buffer) return;
    if (!buffer.includes("<<<")) {
      appendText(buffer);
      return;
    }
    // No END marker yet: report a friendly error for the truncated tool payload.
    appendText("I started preparing a search but the response was interrupted.");
    setChatError({ kind: "interrupted" });
  };

  const handleStop = () => {
    abortRef.current?.abort();
  };

  const handleSend = async (content: string) => {
    if (loading) return;

    const userMessage: Message = { role: "user", content };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setLoading(true);
    clearText();
    setToolState(null);
    setChatError(null);
    setPartial(null);
    setManualScroll(false);
    pendingBufferRef.current = "";

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated
            .filter((m): m is Message => m.role !== "tool")
            .map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        let error: ChatError = { kind: "api" };
        try {
          const err = await res.json();
          const msg = typeof err?.error === "string" ? err.error : undefined;
          if (res.status === 429) error = { kind: "rate_limit", detail: msg };
          else if (msg) error = { kind: "api", detail: msg };
        } catch {}
        throw new ChatRequestError(error);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new ChatRequestError({ kind: "api", detail: "No response stream." });

      const decoder = new TextDecoder();

      while (true) {
        let chunk: Awaited<ReturnType<typeof reader.read>>;
        try {
          chunk = await reader.read();
        } catch {
          throw new ChatRequestError({ kind: "network", detail: "streamed connection lost" });
        }
        const { done, value } = chunk;
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        parseIncoming(text);
      }

      // Stream finished cleanly: drain any leftover segment and commit remaining text.
      drainBuffer();
      if (streamingRef.current.trim()) {
        flushPendingText();
      }
    } catch (e: unknown) {
      if (e instanceof ChatRequestError) {
        if (e.error.kind === "network" && !streamingRef.current.trim() && !pendingBufferRef.current) {
          setChatError({ kind: "network" });
        } else if (e.error.kind === "network") {
          const text = streamingRef.current.trim();
          clearText();
          if (text) setPartial(text);
          setChatError({ kind: "interrupted" });
        } else {
          setChatError(e.error);
        }
      } else if (e instanceof Error && e.name === "AbortError") {
        const text = streamingRef.current.trim();
        clearText();
        if (text) setMessages((prev) => [...prev, { role: "assistant", content: text }]);
      } else {
        const text = streamingRef.current.trim();
        clearText();
        if (text) setPartial(text);
        setChatError({ kind: "unknown" });
      }
    } finally {
      clearText();
      pendingBufferRef.current = "";
      setToolState(null);
      setLoading(false);
      abortRef.current = null;
    }
  };

  const handleRetry = () => {
    const lastUser = [...messages].reverse().find((m): m is Message => m.role === "user");
    setChatError(null);
    setPartial(null);
    if (lastUser) {
      handleSend(lastUser.content);
    }
  };

  const started = messages.some((m) => m.role === "user") || loading || partial || chatError;

  return (
    <div className="flex h-[calc(100dvh-10rem)] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white sm:h-[calc(100vh-8rem)] dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <Bot className="h-5 w-5 text-orange-500" />
        <span className="text-sm font-semibold text-zinc-900 dark:text-white">CookMate AI</span>
      </div>

      <div ref={containerRef} onScroll={handleScroll} className="min-h-0 flex-1 overflow-y-auto py-4">
        <div className="mx-auto flex min-h-full max-w-3xl flex-col">
          {!started && <WelcomeState onPick={(s) => handleSend(s)} />}

          {started &&
            messages.map((msg, i) => {
              if (msg.role === "tool") {
                if (msg.tool.state === "result") {
                  return <RecipeToolResult key={i} data={msg.tool.data} />;
                }
                return <ToolStatus key={i} status="error" error={msg.tool.error} onRetry={handleRetry} />;
              }
              return <ChatMessage key={i} role={msg.role} content={msg.content} />;
            })}

          {partial && <ChatMessage role="assistant" content={partial} />}
          {chatError && <ErrorNotice kind={chatError.kind} detail={chatError.detail} onRetry={handleRetry} />}
          {toolState?.state === "streaming" && <ToolStatus status="streaming" args={toolState.args} />}
          {toolState?.state === "running" && <ToolStatus status="running" args={toolState.args} />}
          {streamingContent && <ChatMessage role="assistant" content={streamingContent} />}
          {loading && !streamingContent && !toolState && <TypingIndicator />}
          <div ref={bottomRef} className="h-px w-full" />
        </div>
      </div>

      <ChatInput onSend={handleSend} onStop={handleStop} loading={loading} />
    </div>
  );
}

class ChatRequestError extends Error {
  error: ChatError;
  constructor(error: ChatError) {
    super(error.detail || error.kind);
    this.error = error;
  }
}