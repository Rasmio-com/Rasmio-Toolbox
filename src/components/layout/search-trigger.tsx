"use client";

import { Search } from "lucide-react";

/** A large, hero-style search box that opens the global command palette. */
export function SearchTrigger() {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent("rasmio:open-search"))}
      className="group mx-auto flex h-14 w-full max-w-xl items-center gap-3 rounded-2xl border border-border bg-surface/70 px-5 text-muted shadow-lg shadow-black/20 transition-colors hover:border-turquoise-dim hover:text-fg"
    >
      <Search className="size-5 shrink-0 text-turquoise" />
      <span className="flex-1 text-start">
        جست‌وجو میان ابزارها… (JSON، Base64، رنگ، تاریخ)
      </span>
      <kbd className="hidden rounded border border-border bg-surface-2 px-2 py-1 font-mono text-xs text-faint sm:block">
        Ctrl K
      </kbd>
    </button>
  );
}
