"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, Boxes } from "lucide-react";
import { SearchCommand } from "./search-command";

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("rasmio:open-search", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("rasmio:open-search", onOpen);
    };
  }, []);

  return (
    <>
      <header className="glass sticky top-0 z-40 border-b border-border">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-turquoise text-bg shadow-[0_6px_20px_-8px] shadow-turquoise/70">
              <Boxes className="size-5" />
            </span>
            <span className="hidden text-lg font-bold tracking-tight text-fg sm:block">
              جعبه‌ابزار
              <span className="text-turquoise"> رسمیو</span>
            </span>
          </Link>

          <button
            onClick={() => setOpen(true)}
            className="group flex h-10 flex-1 items-center gap-3 rounded-xl border border-border bg-bg-soft/80 px-3 text-muted transition-colors hover:border-turquoise-dim hover:text-fg"
          >
            <Search className="size-4 shrink-0" />
            <span className="flex-1 text-start text-sm">جست‌وجوی ابزار…</span>
            <kbd className="hidden rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-faint sm:block">
              Ctrl K
            </kbd>
          </button>

          <Link
            href="/bulk"
            className="hidden shrink-0 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:text-fg md:block"
          >
            اجرای گروهی
          </Link>
          <Link
            href="/#categories"
            className="hidden shrink-0 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:text-fg md:block"
          >
            دسته‌بندی‌ها
          </Link>
        </div>
      </header>

      <SearchCommand open={open} onClose={() => setOpen(false)} />
    </>
  );
}
