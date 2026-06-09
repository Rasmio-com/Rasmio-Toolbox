"use client";

import { useMemo, useState } from "react";
import { CopyButton, ErrorNote, Field, Grid2, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

const TABLE: [number, string][] = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

function toRoman(n: number): string {
  let out = "";
  for (const [v, s] of TABLE) {
    while (n >= v) {
      out += s;
      n -= v;
    }
  }
  return out;
}

const ROMAN_RE = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;

function fromRoman(s: string): number | null {
  const up = s.trim().toUpperCase();
  if (!up || !ROMAN_RE.test(up)) return null;
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < up.length; i++) {
    const cur = map[up[i]];
    const next = map[up[i + 1]] ?? 0;
    total += cur < next ? -cur : cur;
  }
  return total;
}

export default function RomanNumeralTool() {
  const [dec, setDec] = useState("");
  const [rom, setRom] = useState("");

  const decToRoman = useMemo(() => {
    const raw = toAsciiDigits(dec).trim();
    if (!raw) return null;
    const n = Number(raw);
    if (!Number.isInteger(n) || n < 1 || n > 3999)
      return { err: "عددی صحیح بین ۱ تا ۳۹۹۹ وارد کنید." };
    return { err: "", out: toRoman(n) };
  }, [dec]);

  const romToDec = useMemo(() => {
    if (!rom.trim()) return null;
    const n = fromRoman(rom);
    if (n === null) return { err: "عدد رومی نامعتبر است." };
    return { err: "", out: String(n) };
  }, [rom]);

  return (
    <Grid2>
      <div className="space-y-3">
        <Field label="عدد صحیح (۱ تا ۳۹۹۹)">
          <TextInput
            mono
            dir="ltr"
            type="number"
            value={dec}
            onChange={(e) => setDec(e.target.value)}
            placeholder="2024"
          />
        </Field>
        {decToRoman?.err && <ErrorNote>{decToRoman.err}</ErrorNote>}
        {decToRoman && !decToRoman.err && (
          <Result label="عدد رومی" value={decToRoman.out} />
        )}
      </div>

      <div className="space-y-3">
        <Field label="عدد رومی">
          <TextInput
            mono
            dir="ltr"
            value={rom}
            onChange={(e) => setRom(e.target.value)}
            placeholder="MMXXIV"
            className="uppercase"
          />
        </Field>
        {romToDec?.err && <ErrorNote>{romToDec.err}</ErrorNote>}
        {romToDec && !romToDec.err && <Result label="عدد صحیح" value={romToDec.out} />}
      </div>
    </Grid2>
  );
}

function Result({ label, value }: { label: string; value?: string }) {
  const v = value ?? "";
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-3 py-2.5">
      <span className="w-24 shrink-0 text-xs text-saffron">{label}</span>
      <code dir="ltr" className="min-w-0 flex-1 truncate font-mono text-lg font-semibold text-fg">
        {v}
      </code>
      <CopyButton value={v} />
    </div>
  );
}
