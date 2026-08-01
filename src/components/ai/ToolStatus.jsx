"use client";

import { Loader2, Search, XCircle, Bot } from "lucide-react";

/**
 * @typedef {Object} ToolStatusProps
 * @property {"streaming" | "running" | "error"} [status]
 * @property {string | string[]} [args]
 * @property {string} [error]
 * @property {() => void} [onRetry]
 */

/** @param {ToolStatusProps} props */
export function ToolStatus({ status, args, error, onRetry }) {
  if (status === "streaming") {    return (
      <div className="flex items-start gap-3 px-4 py-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
          <Bot className="h-4 w-4 text-orange-600 dark:text-orange-300" />
        </div>
        <div className="flex-1 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800/50">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
            Preparing recipe search
          </div>
          {args && (
            <pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-100 p-2 font-mono text-xs text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
              {args}
            </pre>
          )}
        </div>
      </div>
    );
  }

  if (status === "running") {
    const list = Array.isArray(args) ? args : [];
    return (
      <div className="flex items-start gap-3 px-4 py-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
          <Bot className="h-4 w-4 text-orange-600 dark:text-orange-300" />
        </div>
        <div className="flex-1 rounded-xl border border-zinc-200 bg-orange-50 px-4 py-3 dark:border-zinc-800 dark:bg-orange-950/30">
          <div className="flex items-center gap-2 text-sm font-medium text-orange-700 dark:text-orange-300">
            <Search className="h-4 w-4 animate-pulse" />
            Searching CookMate recipes
          </div>
          {list.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {list.map((ing) => (
                <span
                  key={ing}
                  className="rounded-full bg-orange-500/10 px-2.5 py-0.5 text-xs font-medium capitalize text-orange-700 dark:bg-orange-500/20 dark:text-orange-300"
                >
                  {ing}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-start gap-3 px-4 py-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
          <XCircle className="h-4 w-4 text-red-600 dark:text-red-300" />
        </div>
        <div className="flex-1 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900 dark:bg-red-950/40">
          <p className="text-sm font-medium text-red-700 dark:text-red-300">Recipe search failed</p>
          {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
