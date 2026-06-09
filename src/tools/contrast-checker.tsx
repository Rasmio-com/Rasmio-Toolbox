"use client";

import { useState } from "react";
import { Field, TextInput } from "@/components/tool/kit";
import { contrastRatio, parseHex } from "@/lib/color";

function Badge({ pass, label }: { pass: boolean; label: string }) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
        pass
          ? "border-success/30 bg-success/10 text-success"
          : "border-danger/30 bg-danger/10 text-danger"
      }`}
    >
      <span>{label}</span>
      <span className="font-semibold">{pass ? "قبول ✓" : "رد ✗"}</span>
    </div>
  );
}

function Picker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-14 cursor-pointer rounded-lg border border-border bg-bg-soft p-1"
        />
        <TextInput mono dir="ltr" value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </Field>
  );
}

export default function ContrastCheckerTool() {
  const [fg, setFg] = useState("#e7eef3");
  const [bg, setBg] = useState("#0a0f14");

  const f = parseHex(fg);
  const b = parseHex(bg);
  const ratio = f && b ? contrastRatio(f, b) : null;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Picker label="رنگ متن" value={fg} onChange={setFg} />
        <Picker label="رنگ پس‌زمینه" value={bg} onChange={setBg} />
      </div>

      <div
        className="rounded-2xl border border-border p-8 text-center"
        style={{ background: b ? bg : "#000", color: f ? fg : "#fff" }}
      >
        <p className="text-2xl font-bold">نمونه‌ی متن فارسی</p>
        <p className="mt-1 text-sm">The quick brown fox jumps over the lazy dog</p>
      </div>

      {ratio !== null ? (
        <>
          <div className="text-center">
            <div className="text-4xl font-black tabular-nums text-turquoise">
              {ratio.toFixed(2)} : ۱
            </div>
            <p className="mt-1 text-sm text-muted">نسبت کنتراست</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Badge pass={ratio >= 4.5} label="AA — متن معمولی (۴.۵)" />
            <Badge pass={ratio >= 3} label="AA — متن بزرگ (۳.۰)" />
            <Badge pass={ratio >= 7} label="AAA — متن معمولی (۷.۰)" />
            <Badge pass={ratio >= 4.5} label="AAA — متن بزرگ (۴.۵)" />
          </div>
        </>
      ) : (
        <p className="text-center text-sm text-danger">یکی از کدهای رنگ نامعتبر است.</p>
      )}
    </div>
  );
}
