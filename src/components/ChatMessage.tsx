"use client";

import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex items-start gap-3 px-4 py-3 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
          <Bot className="h-4 w-4 text-orange-600 dark:text-orange-300" />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-orange-500 text-white"
            : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
        }`}
      >
        {content}
      </div>
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500">
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
}