"use client";

import { useState, useId } from "react";

interface DisclosureProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function Disclosure({
  title,
  children,
  defaultOpen = false,
}: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-700">
      <h3 className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((prev) => !prev)}
          className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          <span
            className={`inline-block transition-transform duration-200 ${
              open ? "rotate-90" : ""
            }`}
          >
            &#9654;
          </span>
          {title}
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={panelId}
        hidden={!open}
        className="border-t border-zinc-200 px-4 py-3 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
      >
        {children}
      </div>
    </div>
  );
}
