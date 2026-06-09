"use client";

import { useMemo, useState } from "react";
import { Field, Grid2, Segmented, Stat, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

type Mode = "of" | "whatPct" | "change" | "adjust";

const num = (s: string): number => Number(toAsciiDigits(s).trim());
const fa = (n: number) =>
  Number.isFinite(n) ? n.toLocaleString("fa-IR", { maximumFractionDigits: 4 }) : "—";

export default function PercentageCalculatorTool() {
  const [mode, setMode] = useState<Mode>("of");
  const [x, setX] = useState("");
  const [y, setY] = useState("");

  const labels = useMemo(() => {
    switch (mode) {
      case "of":
        return { x: "درصد (X)", y: "از مقدار (Y)" };
      case "whatPct":
        return { x: "مقدار (X)", y: "از کل (Y)" };
      case "change":
        return { x: "مقدار اولیه (A)", y: "مقدار نهایی (B)" };
      case "adjust":
        return { x: "مقدار (Y)", y: "درصد (X)" };
    }
  }, [mode]);

  const out = useMemo(() => {
    const a = num(x);
    const b = num(y);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
    switch (mode) {
      case "of":
        return [{ label: `${fa(a)}٪ از ${fa(b)}`, value: fa((a / 100) * b) }];
      case "whatPct":
        return [
          { label: `${fa(a)} چند درصدِ ${fa(b)} است`, value: b === 0 ? "—" : `${fa((a / b) * 100)}٪` },
        ];
      case "change": {
        if (a === 0) return [{ label: "تغییر درصدی", value: "—" }];
        const d = ((b - a) / Math.abs(a)) * 100;
        return [
          { label: "تغییر درصدی", value: `${d >= 0 ? "+" : ""}${fa(d)}٪` },
          { label: "اختلاف مطلق", value: fa(b - a) },
        ];
      }
      case "adjust":
        return [
          { label: `افزایش ${fa(b)}٪`, value: fa(a * (1 + b / 100)) },
          { label: `کاهش ${fa(b)}٪`, value: fa(a * (1 - b / 100)) },
        ];
    }
  }, [mode, x, y]);

  return (
    <div className="space-y-5">
      <Segmented
        value={mode}
        onChange={(m) => setMode(m)}
        options={[
          { value: "of", label: "X٪ از Y" },
          { value: "whatPct", label: "X چند درصد Y" },
          { value: "change", label: "تغییر A→B" },
          { value: "adjust", label: "افزایش/کاهش" },
        ]}
      />
      <Grid2>
        <Field label={labels.x}>
          <TextInput
            mono
            dir="ltr"
            type="number"
            value={x}
            onChange={(e) => setX(e.target.value)}
          />
        </Field>
        <Field label={labels.y}>
          <TextInput
            mono
            dir="ltr"
            type="number"
            value={y}
            onChange={(e) => setY(e.target.value)}
          />
        </Field>
      </Grid2>
      {out && (
        <div className="grid gap-3 sm:grid-cols-2">
          {out.map((r) => (
            <Stat key={r.label} label={r.label} value={r.value} />
          ))}
        </div>
      )}
    </div>
  );
}
