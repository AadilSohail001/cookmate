"use client";

import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
        <Bot className="h-4 w-4 text-orange-600 dark:text-orange-300" />
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex h-2 w-24 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-2 w-40 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700" />
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-orange-400" style={{ animationDelay: "0ms" }} />
          <span className="h-2 w-2 animate-bounce rounded-full bg-orange-400" style={{ animationDelay: "150ms" }} />
          <span className="h-2 w-2 animate-bounce rounded-full bg-orange-400" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}