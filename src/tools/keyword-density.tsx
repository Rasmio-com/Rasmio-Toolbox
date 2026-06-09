"use client";

import { useMemo, useState } from "react";
import { Field, Panel, Stat, TextArea } from "@/components/tool/kit";

// Short, very common Persian/English words to ignore.
const STOP = new Set([
  "the", "and", "for", "are", "but", "not", "you", "all", "any", "can", "her",
  "was", "one", "our", "out", "has", "had", "his", "she", "him", "with", "this",
  "that", "from", "they", "your", "have", "will", "what", "when", "your", "into",
  "of", "in", "on", "at", "to", "is", "it", "as", "or", "be", "by", "an", "a",
  "و", "در", "به", "از", "که", "با", "را", "این", "آن", "یک", "است", "برای",
  "تا", "هم", "یا", "هر", "بر", "اما", "ما", "شما", "او", "های", "ها", "می",
]);

export default function KeywordDensityTool() {
  const [text, setText] = useState("");

  const { rows, total } = useMemo(() => {
    const words = (text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []).filter(
      (w) => w.length >= 3 && !STOP.has(w),
    );
    const total = words.length;
    const m = new Map<string, number>();
    for (const w of words) m.set(w, (m.get(w) ?? 0) + 1);
    const rows = [...m.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "fa"))
      .slice(0, 50);
    return { rows, total };
  }, [text]);

  const max = rows.length ? rows[0][1] : 0;

  return (
    <div className="space-y-4">
      <Field label="متن ورودی">
        <TextArea
          mono={false}
          dir="auto"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="متن مقاله یا صفحه خود را اینجا بنویسید…"
        />
      </Field>

      {total > 0 && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="کل کلمات شمارش‌شده" value={total.toLocaleString("fa-IR")} />
            <Stat label="کلمات یکتا" value={rows.length.toLocaleString("fa-IR")} />
          </div>
          <Panel title="پرتکرارترین کلمات">
            <div className="space-y-1.5">
              {rows.map(([w, c]) => {
                const pct = total ? (c / total) * 100 : 0;
                return (
                  <div key={w} className="flex items-center gap-3 text-sm">
                    <span dir="auto" className="w-36 shrink-0 truncate text-fg" title={w}>
                      {w}
                    </span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                      <span
                        className="block h-full rounded-full bg-turquoise"
                        style={{ width: `${max ? (c / max) * 100 : 0}%` }}
                      />
                    </span>
                    <span className="w-10 shrink-0 text-end font-mono text-xs tabular-nums text-muted">
                      {c.toLocaleString("fa-IR")}
                    </span>
                    <span className="w-14 shrink-0 text-end font-mono text-xs tabular-nums text-saffron">
                      {pct.toFixed(1)}٪
                    </span>
                  </div>
                );
              })}
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}
