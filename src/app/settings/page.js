"use client";

import { useState } from "react";
import { Sun, Globe, Bell, Shield } from "lucide-react";

function getInitialDarkMode() {
  try {
    return localStorage.getItem("darkMode") === "true";
  } catch {
    return false;
  }
}

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("darkMode", next);
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-white">Settings</h1>

      <div className="space-y-6">
        <div className="rounded-xl bg-zinc-50 p-6 dark:bg-zinc-900">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-white">
            <Sun className="h-5 w-5 text-orange-500" /> Appearance
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-800 dark:text-zinc-200">Dark Mode</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Toggle between light and dark themes</p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative h-6 w-11 rounded-full transition-colors ${darkMode ? "bg-orange-500" : "bg-zinc-300"}`}
            >
              <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${darkMode ? "translate-x-5" : ""}`} />
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-zinc-50 p-6 dark:bg-zinc-900">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-white">
            <Globe className="h-5 w-5 text-orange-500" /> Language
          </h2>
          <select className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
        </div>

        <div className="rounded-xl bg-zinc-50 p-6 dark:bg-zinc-900">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-white">
            <Bell className="h-5 w-5 text-orange-500" /> Notifications
          </h2>
          <div className="space-y-3">
            {["New Recipes", "Weekly Newsletter", "Recipe Tips"].map((item) => (
              <label key={item} className="flex items-center justify-between">
                <span className="text-sm text-zinc-700 dark:text-zinc-300">{item}</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-zinc-300 text-orange-500 focus:ring-orange-500" />
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-zinc-50 p-6 dark:bg-zinc-900">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-white">
            <Shield className="h-5 w-5 text-orange-500" /> Privacy
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Your data is stored locally in your browser. No personal information is shared or collected.
          </p>
        </div>
      </div>
    </div>
  );
}
