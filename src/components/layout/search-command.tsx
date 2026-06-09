"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft, X } from "lucide-react";
import { searchTools } from "@/lib/tools/search";
import { getFeaturedTools } from "@/lib/tools/meta";
import { getCategory } from "@/lib/tools/categories";
import { CategoryIcon } from "@/components/ui/icon";

export function SearchCommand({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim();
    return q ? searchTools(q, 24) : getFeaturedTools();
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      // focus after paint
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  if (!open) return null;

  const go = (id: string) => {
    onClose();
    router.push(`/tools/${id}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active].id);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh]"
      role="dialog"
      aria-modal
      aria-label="جست‌وجوی ابزار"
    >
      <div
        className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="animate-rise relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/60"
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="size-5 shrink-0 text-faint" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جست‌وجوی ابزار… (مثلاً JSON، Base64، رنگ)"
            className="w-full bg-transparent py-4 text-fg outline-none placeholder:text-faint"
          />
          <button
            onClick={onClose}
            className="shrink-0 rounded-md p-1 text-faint hover:text-fg"
            aria-label="بستن"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="max-h-[52vh] overflow-y-auto p-2">
          {!query && (
            <p className="px-3 py-2 text-xs text-faint">ابزارهای پرکاربرد</p>
          )}
          {results.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-muted">
              نتیجه‌ای یافت نشد.
            </p>
          )}
          {results.map((t, i) => {
            const cat = getCategory(t.category);
            return (
              <button
                key={t.id}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(t.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start transition-colors ${
                  i === active ? "bg-surface-2" : "hover:bg-surface-2/60"
                }`}
              >
                <span
                  className="grid size-9 shrink-0 place-items-center rounded-lg border border-border"
                  style={{ color: cat?.accent }}
                >
                  <CategoryIcon name={cat?.icon ?? ""} className="size-4.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-fg">
                    {t.title}
                  </span>
                  <span className="block truncate text-xs text-muted">
                    {t.titleEn} · {cat?.title}
                  </span>
                </span>
                {i === active && (
                  <CornerDownLeft className="size-4 shrink-0 text-faint" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
