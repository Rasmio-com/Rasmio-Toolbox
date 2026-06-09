"use client";

import { useMemo, useState } from "react";
import { CopyButton, ErrorNote, Field, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

// Engineering notation: exponent is a multiple of 3.
function engineering(n: number): string {
  if (n === 0) return "0e+0";
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  let exp = Math.floor(Math.log10(abs));
  exp = exp - ((exp % 3) + 3) % 3;
  const mantissa = abs / Math.pow(10, exp);
  const m = parseFloat(mantissa.toPrecision(7));
  return `${sign}${m}e${exp >= 0 ? "+" : ""}${exp}`;
}

function scientific(n: number): string {
  if (n === 0) return "0e+0";
  const s = n.toExponential();
  // Normalize "1.5e+4" style and trim trailing zeros in mantissa.
  return s.replace(/(\.\d*?)0+e/, "$1e").replace(/\.e/, "e");
}

export default function ScientificNotationTool() {
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    const raw = toAsciiDigits(input).trim().replace(/\s+/g, "");
    if (!raw) return null;
    const n = Number(raw);
    if (!Number.isFinite(n)) return { err: "عدد نامعتبر است." };
    return {
      err: "",
      sci: scientific(n),
      eng: engineering(n),
      plain: n.toLocaleString("en-US", { maximumFractionDigits: 20, useGrouping: false }),
    };
  }, [input]);

  return (
    <div className="space-y-4">
      <Field
        label="عدد ورودی"
        hint="معمولی یا علمی، مثلاً 12345 یا 1.2e-5"
      >
        <TextInput
          mono
          dir="ltr"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="0.00042"
        />
      </Field>
      {result?.err && <ErrorNote>{result.err}</ErrorNote>}
      {result && !result.err && (
        <div className="space-y-2">
          {[
            { label: "نماد علمی", value: result.sci ?? "" },
            { label: "نماد مهندسی", value: result.eng ?? "" },
            { label: "عدد معمولی", value: result.plain ?? "" },
          ].map((r) => (
            <div
              key={r.label}
              className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-3 py-2.5"
            >
              <span className="w-28 shrink-0 text-xs text-saffron">{r.label}</span>
              <code dir="ltr" className="min-w-0 flex-1 truncate font-mono text-sm text-fg">
                {r.value}
              </code>
              <CopyButton value={r.value} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
