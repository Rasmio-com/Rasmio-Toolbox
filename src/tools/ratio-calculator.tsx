"use client";

import { useMemo, useState } from "react";
import { CopyButton, ErrorNote, Field, Grid2, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

const num = (s: string) => Number(toAsciiDigits(s).trim());
const fa = (n: number) =>
  Number.isFinite(n) ? n.toLocaleString("fa-IR", { maximumFractionDigits: 6 }) : "—";

export default function RatioCalculatorTool() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  const [pa, setPa] = useState("");
  const [pb, setPb] = useState("");
  const [pc, setPc] = useState("");

  const simplified = useMemo(() => {
    const na = num(a);
    const nb = num(b);
    if (!a || !b) return null;
    if (!Number.isInteger(na) || !Number.isInteger(nb))
      return { err: "برای ساده‌سازی، اعداد صحیح وارد کنید." };
    if (nb === 0) return { err: "جزء دوم نمی‌تواند صفر باشد." };
    const g = gcd(na, nb);
    return { err: "", text: `${na / g} : ${nb / g}`, decimal: fa(na / nb) };
  }, [a, b]);

  const proportion = useMemo(() => {
    if (!pa || !pb || !pc) return null;
    const x = num(pa);
    const y = num(pb);
    const z = num(pc);
    if (![x, y, z].every(Number.isFinite)) return { err: "مقادیر عددی نامعتبرند." };
    if (x === 0) return { err: "جزء اول نمی‌تواند صفر باشد." };
    return { err: "", value: fa((y * z) / x) };
  }, [pa, pb, pc]);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-surface/70 p-4 sm:p-5">
        <h3 className="mb-3 text-sm font-semibold text-fg">ساده‌سازی نسبت a : b</h3>
        <Grid2>
          <Field label="جزء اول (a)">
            <TextInput mono dir="ltr" type="number" value={a} onChange={(e) => setA(e.target.value)} />
          </Field>
          <Field label="جزء دوم (b)">
            <TextInput mono dir="ltr" type="number" value={b} onChange={(e) => setB(e.target.value)} />
          </Field>
        </Grid2>
        {simplified?.err && (
          <div className="mt-3">
            <ErrorNote>{simplified.err}</ErrorNote>
          </div>
        )}
        {simplified && !simplified.err && (
          <div className="mt-3 space-y-2">
            <Row label="نسبت ساده" value={simplified.text} />
            <Row label="به صورت اعشار" value={simplified.decimal} />
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-surface/70 p-4 sm:p-5">
        <h3 className="mb-3 text-sm font-semibold text-fg">حل تناسب a : b = c : ?</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="a">
            <TextInput mono dir="ltr" type="number" value={pa} onChange={(e) => setPa(e.target.value)} />
          </Field>
          <Field label="b">
            <TextInput mono dir="ltr" type="number" value={pb} onChange={(e) => setPb(e.target.value)} />
          </Field>
          <Field label="c">
            <TextInput mono dir="ltr" type="number" value={pc} onChange={(e) => setPc(e.target.value)} />
          </Field>
        </div>
        {proportion?.err && (
          <div className="mt-3">
            <ErrorNote>{proportion.err}</ErrorNote>
          </div>
        )}
        {proportion && !proportion.err && (
          <div className="mt-3">
            <Row label="مقدار مجهول (؟)" value={proportion.value} />
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  const v = value ?? "";
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-3 py-2.5">
      <span className="w-32 shrink-0 text-xs text-saffron">{label}</span>
      <code dir="ltr" className="min-w-0 flex-1 truncate font-mono text-lg font-semibold text-fg">
        {v}
      </code>
      <CopyButton value={v} />
    </div>
  );
}
