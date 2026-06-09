"use client";

import { useMemo, useState } from "react";
import { CopyButton, ErrorNote, Field, Grid2, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

// Long division to detect a repeating cycle in num/den.
function decimalString(num: number, den: number): string {
  const sign = num * den < 0 ? "-" : "";
  num = Math.abs(num);
  den = Math.abs(den);
  const intPart = Math.floor(num / den);
  let rem = num % den;
  if (rem === 0) return `${sign}${intPart}`;
  const digits: string[] = [];
  const seen = new Map<number, number>();
  while (rem !== 0 && !seen.has(rem)) {
    seen.set(rem, digits.length);
    rem *= 10;
    digits.push(String(Math.floor(rem / den)));
    rem %= den;
  }
  if (rem === 0) return `${sign}${intPart}.${digits.join("")}`;
  const start = seen.get(rem)!;
  const nonRep = digits.slice(0, start).join("");
  const rep = digits.slice(start).join("");
  return `${sign}${intPart}.${nonRep}(${rep})`;
}

// Convert a finite decimal string to an exact fraction.
function decimalToFraction(s: string): { n: number; d: number } | null {
  const m = s.match(/^(-?)(\d*)(?:\.(\d+))?$/);
  if (!m) return null;
  const sign = m[1] === "-" ? -1 : 1;
  const intp = m[2] || "0";
  const frac = m[3] || "";
  const den = Math.pow(10, frac.length);
  const num = Number(intp) * den + (frac ? Number(frac) : 0);
  return { n: sign * num, d: den };
}

export default function FractionDecimalTool() {
  const [frac, setFrac] = useState("");
  const [dec, setDec] = useState("");

  const fracResult = useMemo(() => {
    const raw = toAsciiDigits(frac).trim();
    if (!raw) return null;
    const m = raw.match(/^(-?\d+)\s*\/\s*(-?\d+)$/);
    if (!m) return { err: "قالب کسر نامعتبر است. مثال: 3/4" };
    const n = Number(m[1]);
    const d = Number(m[2]);
    if (d === 0) return { err: "مخرج نمی‌تواند صفر باشد." };
    const g = gcd(n, d);
    let sn = n / g;
    let sd = d / g;
    if (sd < 0) {
      sn = -sn;
      sd = -sd;
    }
    return {
      err: "",
      decimal: decimalString(n, d),
      simplified: `${sn}/${sd}`,
      approx: (n / d).toLocaleString("en-US", { maximumFractionDigits: 10 }),
    };
  }, [frac]);

  const decResult = useMemo(() => {
    const raw = toAsciiDigits(dec).trim();
    if (!raw) return null;
    if (!/^-?\d*\.?\d+$/.test(raw)) return { err: "عدد اعشاری نامعتبر است." };
    const f = decimalToFraction(raw);
    if (!f) return { err: "عدد اعشاری نامعتبر است." };
    const g = gcd(f.n, f.d);
    return { err: "", fraction: `${f.n / g}/${f.d / g}` };
  }, [dec]);

  return (
    <Grid2>
      <div className="space-y-3">
        <Field label="کسر (a/b)">
          <TextInput
            mono
            dir="ltr"
            value={frac}
            onChange={(e) => setFrac(e.target.value)}
            placeholder="1/3"
          />
        </Field>
        {fracResult?.err && <ErrorNote>{fracResult.err}</ErrorNote>}
        {fracResult && !fracResult.err && (
          <div className="space-y-2">
            <Row label="ساده‌شده" value={fracResult.simplified} />
            <Row label="اعشار دقیق" value={fracResult.decimal} />
            <Row label="تقریبی" value={fracResult.approx} />
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Field label="عدد اعشاری" hint="اعشار متناهی">
          <TextInput
            mono
            dir="ltr"
            value={dec}
            onChange={(e) => setDec(e.target.value)}
            placeholder="0.75"
          />
        </Field>
        {decResult?.err && <ErrorNote>{decResult.err}</ErrorNote>}
        {decResult && !decResult.err && <Row label="کسر" value={decResult.fraction} />}
      </div>
    </Grid2>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  const v = value ?? "";
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-3 py-2.5">
      <span className="w-24 shrink-0 text-xs text-saffron">{label}</span>
      <code dir="ltr" className="min-w-0 flex-1 truncate font-mono text-sm text-fg">
        {v}
      </code>
      <CopyButton value={v} />
    </div>
  );
}
