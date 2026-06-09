"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button, Field, Output, Segmented, TextInput } from "@/components/tool/kit";

interface Stop {
  color: string;
  pos: number;
}

type GType = "linear" | "radial";

export default function GradientGeneratorTool() {
  const [type, setType] = useState<GType>("linear");
  const [angle, setAngle] = useState(90);
  const [stops, setStops] = useState<Stop[]>([
    { color: "#2dd4c4", pos: 0 },
    { color: "#7c3aed", pos: 100 },
  ]);

  const update = (i: number, patch: Partial<Stop>) =>
    setStops((s) => s.map((st, idx) => (idx === i ? { ...st, ...patch } : st)));
  const remove = (i: number) =>
    setStops((s) => (s.length > 2 ? s.filter((_, idx) => idx !== i) : s));
  const add = () => setStops((s) => [...s, { color: "#f59e0b", pos: 50 }]);

  const stopStr = [...stops]
    .sort((a, b) => a.pos - b.pos)
    .map((s) => `${s.color} ${s.pos}%`)
    .join(", ");
  const css =
    type === "linear"
      ? `linear-gradient(${angle}deg, ${stopStr})`
      : `radial-gradient(circle, ${stopStr})`;

  return (
    <div className="space-y-4">
      <div className="h-40 rounded-2xl border border-border shadow-inner" style={{ background: css }} />

      <div className="flex flex-wrap items-end gap-4">
        <Field label="نوع">
          <Segmented
            value={type}
            onChange={setType}
            options={[
              { value: "linear", label: "خطی" },
              { value: "radial", label: "شعاعی" },
            ]}
          />
        </Field>
        {type === "linear" && (
          <Field label={`زاویه: ${angle}°`} className="min-w-48 flex-1">
            <input
              type="range"
              min={0}
              max={360}
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full accent-turquoise"
            />
          </Field>
        )}
      </div>

      <div className="space-y-2">
        {stops.map((s, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-3 py-2">
            <input
              type="color"
              value={s.color}
              onChange={(e) => update(i, { color: e.target.value })}
              className="h-9 w-12 shrink-0 cursor-pointer rounded-md border border-border bg-bg-soft p-0.5"
            />
            <TextInput
              mono
              dir="ltr"
              value={s.color}
              onChange={(e) => update(i, { color: e.target.value })}
              className="w-32"
            />
            <input
              type="range"
              min={0}
              max={100}
              value={s.pos}
              onChange={(e) => update(i, { pos: Number(e.target.value) })}
              className="min-w-0 flex-1 accent-turquoise"
            />
            <span className="w-12 shrink-0 text-end text-xs tabular-nums text-muted">{s.pos}%</span>
            <Button variant="ghost" onClick={() => remove(i)} disabled={stops.length <= 2} aria-label="حذف">
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button variant="secondary" onClick={add}>
          <Plus className="size-4" />
          افزودن ایست رنگ
        </Button>
      </div>

      <Output label="کد CSS" value={`background: ${css};`} className="min-h-20" />
    </div>
  );
}
