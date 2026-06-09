"use client";

import { useState } from "react";
import { CopyButton, Field, TextInput } from "@/components/tool/kit";
import { parseHex, rgbToHsl, rgbToHsv, type RGB } from "@/lib/color";

const r0 = (n: number) => Math.round(n);

function formats(rgb: RGB) {
  const hsl = rgbToHsl(rgb);
  const hsv = rgbToHsv(rgb);
  return [
    { label: "HEX", value: `#${[rgb.r, rgb.g, rgb.b].map((x) => x.toString(16).padStart(2, "0")).join("")}` },
    { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: "HSL", value: `hsl(${r0(hsl.h)}, ${r0(hsl.s)}%, ${r0(hsl.l)}%)` },
    { label: "HSV", value: `hsv(${r0(hsv.h)}, ${r0(hsv.s)}%, ${r0(hsv.v)}%)` },
  ];
}

export default function ColorConverterTool() {
  const [hex, setHex] = useState("#2dd4c4");
  const rgb = parseHex(hex);

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-end">
        <div
          className="h-28 flex-1 rounded-2xl border border-border shadow-inner"
          style={{ background: rgb ? hex : "transparent" }}
        />
        <div className="flex items-end gap-3">
          <Field label="انتخابگر">
            <input
              type="color"
              value={rgb ? hex : "#000000"}
              onChange={(e) => setHex(e.target.value)}
              className="h-11 w-16 cursor-pointer rounded-lg border border-border bg-bg-soft p-1"
            />
          </Field>
          <Field label="کد رنگ (HEX)" className="w-40">
            <TextInput
              mono
              dir="ltr"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              placeholder="#2dd4c4"
            />
          </Field>
        </div>
      </div>

      {rgb ? (
        <div className="space-y-2">
          {formats(rgb).map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-3 py-2.5"
            >
              <span className="w-14 shrink-0 font-mono text-xs font-semibold text-saffron">
                {f.label}
              </span>
              <code dir="ltr" className="min-w-0 flex-1 text-sm text-fg">
                {f.value}
              </code>
              <CopyButton value={f.value} />
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          کد رنگ نامعتبر است. نمونه‌ی صحیح: #2dd4c4
        </p>
      )}
    </div>
  );
}
