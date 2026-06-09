"use client";

import { useMemo, useState } from "react";
import { Field, Panel, Select, TextArea } from "@/components/tool/kit";

type View = "char" | "word" | "ngram";

function countMap(items: string[]): [string, number][] {
  const m = new Map<string, number>();
  for (const it of items) m.set(it, (m.get(it) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "fa"));
}

export default function TextFrequencyTool() {
  const [text, setText] = useState("");
  const [view, setView] = useState<View>("char");
  const [n, setN] = useState("2");

  const data = useMemo(() => {
    if (!text) return [] as [string, number][];
    if (view === "char") {
      const chars = Array.from(text).filter((c) => !/\s/.test(c));
      return countMap(chars);
    }
    const words = text.trim() ? text.trim().split(/\s+/) : [];
    if (view === "word") return countMap(words);
    const size = Math.max(1, Math.min(4, Number(n) || 1));
    const grams: string[] = [];
    for (let i = 0; i + size <= words.length; i++) grams.push(words.slice(i, i + size).join(" "));
    return countMap(grams);
  }, [text, view, n]);

  const max = data.length ? data[0][1] : 0;
  const fa = (x: number) => x.toLocaleString("fa-IR");

  return (
    <div className="space-y-4">
      <Field label="متن ورودی">
        <TextArea
          mono={false}
          dir="auto"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="متن خود را این‌جا بنویسید…"
          className="min-h-40"
        />
      </Field>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-muted">
          نوع شمارش
          <Select value={view} onChange={(e) => setView(e.target.value as View)} className="w-40">
            <option value="char">کاراکتر</option>
            <option value="word">کلمه</option>
            <option value="ngram">N-gram</option>
          </Select>
        </label>
        {view === "ngram" && (
          <label className="flex items-center gap-2 text-sm text-muted">
            n
            <Select value={n} onChange={(e) => setN(e.target.value)} className="w-20">
              <option value="1">۱</option>
              <option value="2">۲</option>
              <option value="3">۳</option>
              <option value="4">۴</option>
            </Select>
          </label>
        )}
        {data.length > 0 && (
          <span className="text-sm text-muted">{fa(data.length)} مورد یکتا</span>
        )}
      </div>
      {data.length > 0 && (
        <Panel title="پرتکرارترین‌ها">
          <div className="max-h-96 space-y-1 overflow-auto">
            {data.slice(0, 200).map(([k, v]) => (
              <div key={k} className="flex items-center gap-3">
                <span
                  dir="ltr"
                  className="w-32 shrink-0 truncate whitespace-pre font-mono text-sm text-fg"
                  title={k}
                >
                  {k === " " ? "␣" : k}
                </span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                  <span
                    className="block h-full rounded-full bg-turquoise"
                    style={{ width: `${max ? (v / max) * 100 : 0}%` }}
                  />
                </span>
                <span className="w-12 shrink-0 text-end font-mono text-xs tabular-nums text-muted">
                  {fa(v)}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}
