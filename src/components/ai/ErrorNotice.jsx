"use client";

import { WifiOff, Timer, ShieldAlert, ZapOff, Bot, RotateCw } from "lucide-react";

const ERROR_CONFIG = {
  network: {
    icon: WifiOff,
    title: "Connection problem",
    message:
      "We couldn't connect to CookMate AI. Please check your internet connection and try again.",
  },
  rate_limit: {
    icon: Timer,
    title: "Too many requests",
    message: "CookMate AI is temporarily busy. Please wait a moment and try again.",
  },
  interrupted: {
    icon: ZapOff,
    title: "Connection interrupted",
    message: "The response was interrupted partway through.",
  },
  api: {
    icon: ShieldAlert,
    title: "Something went wrong",
    message: "We couldn't get a response from CookMate AI.",
  },
  unknown: {
    icon: Bot,
    title: "Unexpected error",
    message: "Something went wrong. Please try again.",
  },
};

/**
 * @typedef {"network" | "rate_limit" | "interrupted" | "api" | "unknown"} ErrorKind
 * @typedef {Object} ErrorNoticeProps
 * @property {ErrorKind} kind
 * @property {string} [detail]
 * @property {() => void} [onRetry]
 */

/** @param {ErrorNoticeProps} props */
export function ErrorNotice({ kind, detail, onRetry }) {
  const config = ERROR_CONFIG[kind] ?? ERROR_CONFIG.unknown;
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
        <Icon className="h-4 w-4 text-red-600 dark:text-red-300" />
      </div>
      <div className="flex-1 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900 dark:bg-red-950/40">
        <p className="text-sm font-semibold text-red-700 dark:text-red-300">{config.title}</p>
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{config.message}</p>
        {detail && (
          <p className="mt-1 break-words text-xs text-red-500/80 dark:text-red-500">{detail}</p>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700"
          >
            <RotateCw className="h-3.5 w-3.5" />
            {kind === "rate_limit" ? "Try Again" : "Retry"}
          </button>
        )}
      </div>
    </div>
  );
}