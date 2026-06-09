"use client";

import { useState } from "react";
import { Field, Output } from "@/components/tool/kit";

function Slider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <Field label={`${label}: ${value}px`}>
      <input
        type="range"
        min={0}
        max={150}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-turquoise"
      />
    </Field>
  );
}

export default function BorderRadiusGeneratorTool() {
  const [tl, setTl] = useState(24);
  const [tr, setTr] = useState(24);
  const [br, setBr] = useState(24);
  const [bl, setBl] = useState(24);

  const allEqual = tl === tr && tr === br && br === bl;
  const radius = allEqual ? `${tl}px` : `${tl}px ${tr}px ${br}px ${bl}px`;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Slider label="بالا چپ" value={tl} onChange={setTl} />
          <Slider label="بالا راست" value={tr} onChange={setTr} />
          <Slider label="پایین چپ" value={bl} onChange={setBl} />
          <Slider label="پایین راست" value={br} onChange={setBr} />
        </div>
        <Output label="کد CSS" value={`border-radius: ${radius};`} className="min-h-20" />
      </div>

      <div className="flex min-h-64 items-center justify-center rounded-2xl border border-border bg-bg-soft p-8">
        <div
          className="size-44 border-2 border-turquoise bg-turquoise/20"
          style={{ borderRadius: radius }}
        />
      </div>
    </div>
  );
}
