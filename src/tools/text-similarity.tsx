"use client";

import { useMemo, useState } from "react";
import { Field, Grid2, Stat, TextArea } from "@/components/tool/kit";

function levenshtein(a: string, b: string): number {
  const A = Array.from(a);
  const B = Array.from(b);
  const m = A.length;
  const n = B.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let cur = new Array<number>(n + 1);
  for (let i = 1; i <= m; i++) {
    cur[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = A[i - 1] === B[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, cur] = [cur, prev];
  }
  return prev[n];
}

function wordSet(s: string): Set<string> {
  return new Set(s.toLowerCase().trim().split(/\s+/).filter(Boolean));
}

export default function TextSimilarityTool() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  const s = useMemo(() => {
    if (!a && !b) return null;
    const dist = levenshtein(a, b);
    const maxLen = Math.max(Array.from(a).length, Array.from(b).length);
    const sim = maxLen === 0 ? 100 : (1 - dist / maxLen) * 100;
    const sa = wordSet(a);
    const sb = wordSet(b);
    const inter = [...sa].filter((w) => sb.has(w)).length;
    const union = new Set([...sa, ...sb]).size;
    const jaccard = union === 0 ? 0 : (inter / union) * 100;
    const dice = sa.size + sb.size === 0 ? 0 : (2 * inter) / (sa.size + sb.size) * 100;
    return { dist, sim, jaccard, dice };
  }, [a, b]);

  const fa1 = (x: number) => x.toLocaleString("fa-IR", { maximumFractionDigits: 1 });

  return (
    <div className="space-y-4">
      <Grid2>
        <Field label="متن اول">
          <TextArea
            mono={false}
            dir="auto"
            value={a}
            onChange={(e) => setA(e.target.value)}
            placeholder="متن نخست…"
            className="min-h-40"
          />
        </Field>
        <Field label="متن دوم">
          <TextArea
            mono={false}
            dir="auto"
            value={b}
            onChange={(e) => setB(e.target.value)}
            placeholder="متن دوم…"
            className="min-h-40"
          />
        </Field>
      </Grid2>
      {s && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="فاصله لِوِنشتاین" value={s.dist.toLocaleString("fa-IR")} />
          <Stat label="درصد شباهت" value={`${fa1(s.sim)}٪`} />
          <Stat label="Jaccard (کلمات)" value={`${fa1(s.jaccard)}٪`} />
          <Stat label="ضریب Dice" value={`${fa1(s.dice)}٪`} />
        </div>
      )}
    </div>
  );
}
