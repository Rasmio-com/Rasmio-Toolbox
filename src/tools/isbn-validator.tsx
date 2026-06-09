"use client";

import { useMemo, useState } from "react";
import { CopyButton, Field, Panel, Stat, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

function isbn10Valid(s: string): boolean {
  if (!/^\d{9}[\dX]$/.test(s)) return false;
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    const d = s[i] === "X" ? 10 : s.charCodeAt(i) - 48;
    sum += d * (10 - i);
  }
  return sum % 11 === 0;
}

function isbn13Valid(s: string): boolean {
  if (!/^\d{13}$/.test(s)) return false;
  let sum = 0;
  for (let i = 0; i < 13; i++) sum += (s.charCodeAt(i) - 48) * (i % 2 === 0 ? 1 : 3);
  return sum % 10 === 0;
}

function check13(twelve: string): string {
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += (twelve.charCodeAt(i) - 48) * (i % 2 === 0 ? 1 : 3);
  return String((10 - (sum % 10)) % 10);
}

function check10(nine: string): string {
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += (nine.charCodeAt(i) - 48) * (10 - i);
  const r = (11 - (sum % 11)) % 11;
  return r === 10 ? "X" : String(r);
}

function to13(isbn10: string): string {
  const core = "978" + isbn10.slice(0, 9);
  return core + check13(core);
}

function to10(isbn13: string): string | null {
  if (!isbn13.startsWith("978")) return null; // only 978-prefixed convert to ISBN-10
  const core = isbn13.slice(3, 12);
  return core + check10(core);
}

export default function IsbnValidatorTool() {
  const [raw, setRaw] = useState("");

  const r = useMemo(() => {
    const s = toAsciiDigits(raw).replace(/[\s-]/g, "").toUpperCase();
    if (!s) return null;
    if (s.length === 10) {
      const ok = isbn10Valid(s);
      return { type: "ISBN-10", ok, converted: ok ? to13(s) : null, convLabel: "تبدیل به ISBN-13" };
    }
    if (s.length === 13) {
      const ok = isbn13Valid(s);
      return { type: "ISBN-13", ok, converted: ok ? to10(s) : null, convLabel: "تبدیل به ISBN-10" };
    }
    return { error: "طول شابک باید ۱۰ یا ۱۳ رقم باشد." };
  }, [raw]);

  return (
    <div className="space-y-4">
      <Field label="شابک (ISBN)" hint="۱۰ یا ۱۳ رقمی">
        <TextInput
          mono
          dir="ltr"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder="978-3-16-148410-0"
        />
      </Field>

      {r && "error" in r && <p className="text-sm text-danger">{r.error}</p>}

      {r && !("error" in r) && (
        <Panel title={r.ok ? `${r.type} معتبر ✓` : `${r.type} نامعتبر ✗`}>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="نوع" value={<span className="text-base">{r.type}</span>} />
            <Stat
              label="رقم کنترلی"
              value={r.ok ? <span className="text-success">درست</span> : <span className="text-danger">نادرست</span>}
            />
          </div>
          {r.ok && r.converted && (
            <Field label={r.convLabel} className="mt-3">
              <div className="flex items-center gap-2">
                <TextInput mono dir="ltr" readOnly value={r.converted} />
                <CopyButton value={r.converted} />
              </div>
            </Field>
          )}
          {r.ok && !r.converted && (
            <p className="mt-3 text-xs text-faint">تبدیل به ISBN-10 فقط برای شابک‌های با پیشوند ۹۷۸ ممکن است.</p>
          )}
        </Panel>
      )}

      {!r && <p className="text-sm text-muted">یک شابک وارد کنید تا اعتبارسنجی و تبدیل شود.</p>}
    </div>
  );
}
