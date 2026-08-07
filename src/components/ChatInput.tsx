"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Square } from "lucide-react";
import { cn } from "@/utils/cn";

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  loading: boolean;
}

export function ChatInput({ onSend, onStop, loading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    onSend(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const hasImage = Array.from(e.clipboardData.items).some((item) => item.type.startsWith("image/"));
    if (hasImage) {
      e.preventDefault();
    }
  };

  return (
    <div className="border-t border-zinc-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-3xl items-end gap-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          autoComplete="off"
          autoCapitalize="sentences"
          name="message"
          maxLength={2000}
          placeholder="Ask for a recipe, cooking tip, or meal idea..."
          rows={1}
          className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border border-zinc-300 bg-white px-4 py-3 text-[16px] leading-snug text-zinc-900 placeholder:text-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
        {loading ? (
          <button
            onClick={onStop}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500 text-white transition-colors hover:bg-red-600"
            aria-label="Stop generating"
          >
            <Square className="h-4 w-4 fill-current" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
              input.trim()
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"
            )}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}