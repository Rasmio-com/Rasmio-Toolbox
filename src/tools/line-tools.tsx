"use client";

import { useMemo, useState } from "react";
import { Field, Grid2, Output, Select, TextArea, Toggle } from "@/components/tool/kit";

type SortMode = "none" | "asc" | "desc" | "reverse" | "shuffle";

// Deterministic shuffle (seeded) so output is stable across re-renders.
function seededShuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  let seed = a.length * 2654435761;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function LineToolsTool() {
  const [text, setText] = useState("");
  const [trim, setTrim] = useState(false);
  const [removeEmpty, setRemoveEmpty] = useState(false);
  const [unique, setUnique] = useState(false);
  const [number, setNumber] = useState(false);
  const [sort, setSort] = useState<SortMode>("none");

  const out = useMemo(() => {
    let lines = text.split(/\r\n|\r|\n/);
    if (trim) lines = lines.map((l) => l.trim());
    if (removeEmpty) lines = lines.filter((l) => l.trim() !== "");
    if (unique) lines = Array.from(new Set(lines));
    if (sort === "asc") lines.sort((a, b) => a.localeCompare(b, "fa"));
    else if (sort === "desc") lines.sort((a, b) => b.localeCompare(a, "fa"));
    else if (sort === "reverse") lines.reverse();
    else if (sort === "shuffle") lines = seededShuffle(lines);
    if (number) {
      const pad = String(lines.length).length;
      lines = lines.map((l, i) => `${String(i + 1).padStart(pad, " ")}. ${l}`);
    }
    return lines.join("\n");
  }, [text, trim, removeEmpty, unique, number, sort]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-xl border border-border bg-surface/40 px-4 py-3">
        <Toggle checked={trim} onChange={setTrim} label="حذف فاصله‌ی ابتدا/انتها" />
        <Toggle checked={removeEmpty} onChange={setRemoveEmpty} label="حذف خطوط خالی" />
        <Toggle checked={unique} onChange={setUnique} label="حذف تکراری‌ها" />
        <Toggle checked={number} onChange={setNumber} label="شماره‌گذاری" />
        <label className="flex items-center gap-2 text-sm text-muted">
          مرتب‌سازی
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
            className="w-36"
          >
            <option value="none">بدون تغییر</option>
            <option value="asc">صعودی (الفبا)</option>
            <option value="desc">نزولی (الفبا)</option>
            <option value="reverse">معکوس کردن ترتیب</option>
            <option value="shuffle">تصادفی</option>
          </Select>
        </label>
      </div>
      <Grid2>
        <Field label="ورودی">
          <TextArea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={"خط اول\nخط دوم\nخط سوم"}
            className="min-h-56"
          />
        </Field>
        <Output label="خروجی" value={out} className="min-h-56" />
      </Grid2>
    </div>
  );
}
