"use client";

import { useState } from "react";
import { Field, Output } from "@/components/tool/kit";

interface Def {
  key: string;
  label: string;
  min: number;
  max: number;
  def: number;
  unit: string;
}

const DEFS: Def[] = [
  { key: "blur", label: "محو", min: 0, max: 20, def: 0, unit: "px" },
  { key: "brightness", label: "روشنایی", min: 0, max: 200, def: 100, unit: "%" },
  { key: "contrast", label: "کنتراست", min: 0, max: 200, def: 100, unit: "%" },
  { key: "grayscale", label: "خاکستری", min: 0, max: 100, def: 0, unit: "%" },
  { key: "saturate", label: "اشباع", min: 0, max: 300, def: 100, unit: "%" },
  { key: "sepia", label: "سپیا", min: 0, max: 100, def: 0, unit: "%" },
  { key: "hue-rotate", label: "چرخش رنگ", min: 0, max: 360, def: 0, unit: "deg" },
  { key: "invert", label: "معکوس", min: 0, max: 100, def: 0, unit: "%" },
];

export default function CssFilterGeneratorTool() {
  const [vals, setVals] = useState<Record<string, number>>(
    () => Object.fromEntries(DEFS.map((d) => [d.key, d.def])),
  );

  const filter = DEFS.filter((d) => vals[d.key] !== d.def)
    .map((d) => `${d.key}(${vals[d.key]}${d.unit})`)
    .join(" ");
  const applied = filter || "none";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-3">
        {DEFS.map((d) => (
          <Field key={d.key} label={`${d.label}: ${vals[d.key]}${d.unit}`}>
            <input
              type="range"
              min={d.min}
              max={d.max}
              value={vals[d.key]}
              onChange={(e) => setVals((v) => ({ ...v, [d.key]: Number(e.target.value) }))}
              className="w-full accent-turquoise"
            />
          </Field>
        ))}
        <Output label="کد CSS" value={`filter: ${applied};`} className="min-h-16" />
      </div>

      <div className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-bg-soft p-6">
        <div
          className="flex size-40 items-center justify-center rounded-2xl bg-gradient-to-br from-turquoise via-saffron to-danger text-lg font-bold text-bg"
          style={{ filter: applied }}
        >
          نمونه
        </div>
        <p className="text-xs text-muted">پیش‌نمایش با فیلتر اعمال‌شده</p>
      </div>
    </div>
  );
}
