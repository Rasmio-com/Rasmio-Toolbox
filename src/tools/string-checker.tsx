"use client";

import { useMemo, useState } from "react";
import { Field, Grid2, Stat, TextArea } from "@/components/tool/kit";

function normalize(s: string): string {
  return Array.from(s.toLowerCase().replace(/\s+/g, "")).sort().join("");
}

export default function StringCheckerTool() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  const palindrome = useMemo(() => {
    if (!a.trim()) return null;
    const clean = Array.from(a.toLowerCase().replace(/[\s\p{P}]/gu, ""));
    if (clean.length === 0) return null;
    return clean.join("") === [...clean].reverse().join("");
  }, [a]);

  const anagram = useMemo(() => {
    if (!a.trim() || !b.trim()) return null;
    return normalize(a) === normalize(b);
  }, [a, b]);

  const yesNo = (v: boolean | null) =>
    v === null ? "—" : v ? <span className="text-success">بله</span> : <span className="text-danger">خیر</span>;

  return (
    <div className="space-y-4">
      <Grid2>
        <Field label="متن اول">
          <TextArea
            mono={false}
            dir="auto"
            value={a}
            onChange={(e) => setA(e.target.value)}
            placeholder="مثلاً: اَبَب یا radar"
            className="min-h-32"
          />
        </Field>
        <Field label="متن دوم (برای آناگرام)">
          <TextArea
            mono={false}
            dir="auto"
            value={b}
            onChange={(e) => setB(e.target.value)}
            placeholder="مثلاً: listen / silent"
            className="min-h-32"
          />
        </Field>
      </Grid2>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="متقارن است؟ (متن اول)" value={yesNo(palindrome)} />
        <Stat label="آناگرام است؟ (اول و دوم)" value={yesNo(anagram)} />
      </div>
      <p className="text-xs text-faint">
        در بررسی متقارن بودن، فاصله‌ها و نشانه‌های نگارشی نادیده گرفته می‌شوند. در آناگرام، بزرگی/کوچکی حروف و فاصله‌ها بی‌اثر است.
      </p>
    </div>
  );
}
