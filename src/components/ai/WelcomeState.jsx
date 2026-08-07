"use client";

import { ChefHat, ArrowRight } from "lucide-react";

const SUGGESTIONS = [
  "What can I cook with eggs and tomatoes?",
  "Give me a quick vegetarian dinner",
  "Suggest a 30-minute pasta recipe",
  "I have chicken and rice, what can I make?",
];

/**
 * @typedef {Object} WelcomeStateProps
 * @property {(suggestion: string) => void} onPick
 */

/** @param {WelcomeStateProps} props */
export function WelcomeState({ onPick }) {
  return (
    <div className="flex flex-col items-center px-4 py-10 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
        <ChefHat className="h-8 w-8 text-orange-600 dark:text-orange-300" />
      </div>
      <h2 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-white">
        Welcome to CookMate AI Chef
      </h2>
      <p className="mt-2 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
        I&apos;m here to help you discover your next meal. Tell me what you have
        in your kitchen and I&apos;ll find recipes that match.
      </p>

      <div className="mt-6 flex w-full max-w-md flex-col gap-2">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onPick(suggestion)}
            className="group flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left text-sm text-zinc-700 transition-all hover:border-orange-300 hover:text-orange-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-orange-700 dark:hover:text-orange-400"
          >
            <span>{suggestion}</span>
            <ArrowRight className="h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:text-orange-500" />
          </button>
        ))}
      </div>
    </div>
  );
}