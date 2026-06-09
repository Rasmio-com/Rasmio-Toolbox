"use client";

import { useMemo, useState } from "react";
import { CopyButton, ErrorNote, Field, Select, TextInput } from "@/components/tool/kit";

const BASES = [
  { b: 2, label: "دودویی (Binary)" },
  { b: 8, label: "هشت‌هشتی (Octal)" },
  { b: 10, label: "ده‌دهی (Decimal)" },
  { b: 16, label: "شانزده‌گانه (Hex)" },
  { b: 36, label: "Base36" },
];

function parseInBase(input: string, base: number): bigint | null {
  let s = input.trim().toLowerCase().replace(/\s+/g, "");
  if (!s) return null;
  let neg = false;
  if (s[0] === "-") {
    neg = true;
    s = s.slice(1);
  }
  const digits = "0123456789abcdefghijklmnopqrstuvwxyz".slice(0, base);
  let v = 0n;
  for (const ch of s) {
    const d = digits.indexOf(ch);
    if (d < 0) return null;
    v = v * BigInt(base) + BigInt(d);
  }
  return neg ? -v : v;
}

export default function NumberBaseTool() {
  const [input, setInput] = useState("");
  const [base, setBase] = useState(10);

  const { rows, err } = useMemo(() => {
    if (!input.trim()) return { rows: [], err: "" };
    const v = parseInBase(input, base);
    if (v === null) return { rows: [], err: "عدد برای مبنای انتخاب‌شده نامعتبر است." };
    return {
      rows: BASES.map((x) => ({ label: x.label, value: v.toString(x.b) })),
      err: "",
    };
  }, [input, base]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <Field label="عدد ورودی">
          <TextInput
            mono
            dir="ltr"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="مثلاً 255 یا ff"
          />
        </Field>
        <Field label="مبنای ورودی" className="sm:w-48">
          <Select value={base} onChange={(e) => setBase(Number(e.target.value))}>
            {BASES.map((x) => (
              <option key={x.b} value={x.b}>
                {x.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      {err && <ErrorNote>{err}</ErrorNote>}
      <div className="space-y-2">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-3 py-2.5"
          >
            <span className="w-44 shrink-0 text-xs text-saffron">{r.label}</span>
            <code dir="ltr" className="min-w-0 flex-1 truncate font-mono text-sm text-fg">
              {r.value}
            </code>
            <CopyButton value={r.value} />
          </div>
        ))}
      </div>
    </div>
  );
}
