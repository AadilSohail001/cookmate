"use client";

import { useState, useRef, useCallback } from "react";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id ?? "");
  const tablistRef = useRef<HTMLDivElement>(null);

  const getTabElements = useCallback(() => {
    if (!tablistRef.current) return [];
    return Array.from(
      tablistRef.current.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]:not([disabled])'
      )
    );
  }, []);

  const activateTab = (id: string) => {
    setActiveTab(id);
    const btn = tablistRef.current?.querySelector<HTMLButtonElement>(
      `[role="tab"][data-tab-id="${id}"]`
    );
    btn?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const tabs_ = getTabElements();
    if (tabs_.length === 0) return;

    const currentIdx = tabs_.findIndex(
      (t) => t.getAttribute("data-tab-id") === activeTab
    );
    let nextIdx: number | null = null;

    switch (e.key) {
      case "ArrowRight":
        nextIdx = (currentIdx + 1) % tabs_.length;
        break;
      case "ArrowLeft":
        nextIdx = (currentIdx - 1 + tabs_.length) % tabs_.length;
        break;
      case "Home":
        nextIdx = 0;
        break;
      case "End":
        nextIdx = tabs_.length - 1;
        break;
      case "Tab":
        return;
      default:
        return;
    }

    e.preventDefault();
    const nextTabId = tabs_[nextIdx].getAttribute("data-tab-id");
    if (nextTabId) activateTab(nextTabId);
  };

  const activePanel = tabs.find((t) => t.id === activeTab);

  return (
    <div>
      <div
        ref={tablistRef}
        role="tablist"
        aria-label="Tab navigation"
        onKeyDown={handleKeyDown}
        className="flex border-b border-zinc-200 dark:border-zinc-700"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            data-tab-id={tab.id}
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => activateTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activePanel && (
        <div
          id={`panel-${activePanel.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${activePanel.id}`}
          className="p-4 text-zinc-700 dark:text-zinc-300"
        >
          {activePanel.content}
        </div>
      )}
    </div>
  );
}
