"use client";

import { useState } from "react";
import { CopyButton, Field, TextInput } from "@/components/tool/kit";
import { parseHex, rgbToHsl, toHex, type RGB } from "@/lib/color";

const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));

function mix(rgb: RGB, target: number, ratio: number): RGB {
  return {
    r: clamp(rgb.r + (target - rgb.r) * ratio),
    g: clamp(rgb.g + (target - rgb.g) * ratio),
    b: clamp(rgb.b + (target - rgb.b) * ratio),
  };
}

function hslToRgb(h: number, s: number, l: number): RGB {
  h /= 360;
  s /= 100;
  l /= 100;
  const f = (n: number) => {
    const k = (n + h * 12) % 12;
    const a = s * Math.min(l, 1 - l);
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return { r: clamp(f(0) * 255), g: clamp(f(8) * 255), b: clamp(f(4) * 255) };
}

function rotate(rgb: RGB, deg: number): RGB {
  const { h, s, l } = rgbToHsl(rgb);
  return hslToRgb((h + deg + 360) % 360, s, l);
}

function Swatch({ hex }: { hex: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-bg-soft">
      <div className="h-16" style={{ background: hex }} />
      <div className="flex items-center justify-between gap-2 px-2.5 py-2">
        <code dir="ltr" className="text-xs text-fg">
          {hex}
        </code>
        <CopyButton value={hex} label="" />
      </div>
    </div>
  );
}

function Row({ title, colors }: { title: string; colors: string[] }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-fg">{title}</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
        {colors.map((c, i) => (
          <Swatch key={`${c}-${i}`} hex={c} />
        ))}
      </div>
    </div>
  );
}

export default function ColorPaletteTool() {
  const [hex, setHex] = useState("#2dd4c4");
  const rgb = parseHex(hex);

  return (
    <div className="space-y-5">
      <div className="flex items-end gap-3">
        <Field label="انتخابگر">
          <input
            type="color"
            value={rgb ? toHex(rgb) : "#000000"}
            onChange={(e) => setHex(e.target.value)}
            className="h-11 w-16 cursor-pointer rounded-lg border border-border bg-bg-soft p-1"
          />
        </Field>
        <Field label="رنگ پایه (HEX)" className="w-44">
          <TextInput
            mono
            dir="ltr"
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            placeholder="#2dd4c4"
          />
        </Field>
      </div>

      {rgb ? (
        <div className="space-y-5">
          <Row
            title="روشن‌تر (Tints)"
            colors={[0.15, 0.3, 0.45, 0.6, 0.78].map((r) => toHex(mix(rgb, 255, r)))}
          />
          <Row
            title="تیره‌تر (Shades)"
            colors={[0.15, 0.3, 0.45, 0.6, 0.78].map((r) => toHex(mix(rgb, 0, r)))}
          />
          <Row title="مکمل (Complementary)" colors={[toHex(rgb), toHex(rotate(rgb, 180))]} />
          <Row
            title="مشابه (Analogous)"
            colors={[toHex(rotate(rgb, -30)), toHex(rgb), toHex(rotate(rgb, 30))]}
          />
          <Row
            title="سه‌گانه (Triadic)"
            colors={[toHex(rgb), toHex(rotate(rgb, 120)), toHex(rotate(rgb, 240))]}
          />
        </div>
      ) : (
        <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          کد رنگ نامعتبر است. نمونه‌ی صحیح: #2dd4c4
        </p>
      )}
    </div>
  );
}
