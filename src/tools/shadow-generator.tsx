"use client";

import { useState } from "react";
import { Field, Output, TextInput, Toggle } from "@/components/tool/kit";
import { parseHex } from "@/lib/color";

function Slider({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <Field label={`${label}: ${value}px`}>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-turquoise"
      />
    </Field>
  );
}

export default function ShadowGeneratorTool() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(10);
  const [blur, setBlur] = useState(25);
  const [spread, setSpread] = useState(-5);
  const [color, setColor] = useState("#0a0f14");
  const [opacity, setOpacity] = useState(35);
  const [inset, setInset] = useState(false);

  const rgb = parseHex(color) ?? { r: 0, g: 0, b: 0 };
  const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(opacity / 100).toFixed(2)})`;
  const shadow = `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${rgba}`;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Slider label="افقی (X)" value={x} onChange={setX} min={-100} max={100} />
          <Slider label="عمودی (Y)" value={y} onChange={setY} min={-100} max={100} />
          <Slider label="محو" value={blur} onChange={setBlur} min={0} max={150} />
          <Slider label="گسترش" value={spread} onChange={setSpread} min={-50} max={50} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="رنگ سایه">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-11 w-12 shrink-0 cursor-pointer rounded-lg border border-border bg-bg-soft p-1"
              />
              <TextInput mono dir="ltr" value={color} onChange={(e) => setColor(e.target.value)} />
            </div>
          </Field>
          <Field label={`شفافیت: ${opacity}%`}>
            <input
              type="range"
              min={0}
              max={100}
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full accent-turquoise"
            />
          </Field>
        </div>
        <Toggle checked={inset} onChange={setInset} label="سایه‌ی داخلی (inset)" />
        <Output label="کد CSS" value={`box-shadow: ${shadow};`} className="min-h-20" />
      </div>

      <div className="flex min-h-64 items-center justify-center rounded-2xl border border-border bg-bg-soft p-8">
        <div className="size-40 rounded-2xl bg-surface" style={{ boxShadow: shadow }} />
      </div>
    </div>
  );
}
