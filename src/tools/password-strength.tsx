"use client";

import { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Field, Stat, TextInput } from "@/components/tool/kit";

function humanize(seconds: number): string {
  if (seconds < 1) return "آنی";
  const units: [number, string][] = [
    [60, "ثانیه"],
    [60, "دقیقه"],
    [24, "ساعت"],
    [365, "روز"],
    [1000, "سال"],
  ];
  let v = seconds;
  let label = "ثانیه";
  for (const [factor, name] of units) {
    if (v < factor) {
      label = name;
      break;
    }
    v /= factor;
    label = name;
  }
  if (v > 1e6) return "بیش از یک میلیون سال";
  return `${Math.round(v).toLocaleString("fa-IR")} ${label}`;
}

const BANDS = [
  { max: 28, label: "بسیار ضعیف", color: "#f87171", w: 20 },
  { max: 36, label: "ضعیف", color: "#fb923c", w: 40 },
  { max: 60, label: "متوسط", color: "#fbbf24", w: 60 },
  { max: 128, label: "قوی", color: "#34d399", w: 80 },
  { max: Infinity, label: "بسیار قوی", color: "#2dd4c4", w: 100 },
];

export default function PasswordStrengthTool() {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);

  const result = useMemo(() => {
    if (!pw) return null;
    let pool = 0;
    if (/[a-z]/.test(pw)) pool += 26;
    if (/[A-Z]/.test(pw)) pool += 26;
    if (/[0-9]/.test(pw)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(pw)) pool += 33;
    const entropy = pw.length * Math.log2(pool || 1);
    const band = BANDS.find((b) => entropy < b.max)!;
    const seconds = Math.pow(2, entropy) / 1e10; // ~10^10 guesses/sec offline
    return { entropy, pool, seconds, band };
  }, [pw]);

  return (
    <div className="space-y-5">
      <Field label="رمز عبور">
        <div className="relative">
          <TextInput
            type={show ? "text" : "password"}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="رمز عبور را وارد کنید…"
            className="pe-11"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute inset-y-0 end-3 my-auto text-faint hover:text-fg"
            aria-label={show ? "پنهان کردن" : "نمایش"}
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </Field>

      {result && (
        <>
          <div>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-muted">قدرت</span>
              <span style={{ color: result.band.color }} className="font-semibold">
                {result.band.label}
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${result.band.w}%`, background: result.band.color }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat label="طول" value={pw.length.toLocaleString("fa-IR")} />
            <Stat label="آنتروپی (بیت)" value={Math.round(result.entropy)} />
            <Stat
              label="زمان تخمینی شکستن"
              value={<span className="text-base">{humanize(result.seconds)}</span>}
            />
          </div>

          <p className="text-xs text-faint">
            این یک برآورد تقریبی بر اساس آنتروپی است و تضمین امنیتی محسوب نمی‌شود.
          </p>
        </>
      )}
    </div>
  );
}
