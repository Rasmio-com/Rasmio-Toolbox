"use client";

import { useMemo, useState } from "react";
import { CopyButton, ErrorNote, Field, Grid2, Segmented, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

function breakdown(totalSec: number) {
  let s = Math.floor(totalSec);
  const d = Math.floor(s / 86400);
  s -= d * 86400;
  const h = Math.floor(s / 3600);
  s -= h * 3600;
  const m = Math.floor(s / 60);
  s -= m * 60;
  return { d, h, m, s };
}

function human(totalSec: number): string {
  const { d, h, m, s } = breakdown(totalSec);
  const parts: string[] = [];
  if (d) parts.push(`${d}d`);
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  if (s || parts.length === 0) parts.push(`${s}s`);
  return parts.join(" ");
}

function iso8601(totalSec: number): string {
  const { d, h, m, s } = breakdown(totalSec);
  let out = "P";
  if (d) out += `${d}D`;
  if (h || m || s) {
    out += "T";
    if (h) out += `${h}H`;
    if (m) out += `${m}M`;
    if (s || (!h && !m)) out += `${s}S`;
  }
  return out === "P" ? "PT0S" : out;
}

// Parse "1h2m3s" / "90m" / "1d 5h" → seconds.
function parseDuration(str: string): number | null {
  const s = toAsciiDigits(str).trim().toLowerCase();
  if (!s) return null;
  const re = /(\d+(?:\.\d+)?)\s*(d|h|m|s)/g;
  let total = 0;
  let matched = false;
  let mm: RegExpExecArray | null;
  while ((mm = re.exec(s)) !== null) {
    matched = true;
    const v = parseFloat(mm[1]);
    const u = mm[2];
    total += u === "d" ? v * 86400 : u === "h" ? v * 3600 : u === "m" ? v * 60 : v;
  }
  return matched ? total : null;
}

export default function DurationFormatterTool() {
  const [unit, setUnit] = useState<"s" | "ms">("s");
  const [value, setValue] = useState("");
  const [parseStr, setParseStr] = useState("");

  const fmt = useMemo(() => {
    const raw = toAsciiDigits(value).trim();
    if (!raw) return null;
    const n = Number(raw);
    if (!Number.isFinite(n) || n < 0) return { err: "عدد نامعتبر است." };
    const sec = unit === "ms" ? n / 1000 : n;
    return { err: "", human: human(sec), iso: iso8601(sec) };
  }, [value, unit]);

  const parsed = useMemo(() => {
    if (!parseStr.trim()) return null;
    const sec = parseDuration(parseStr);
    if (sec === null) return { err: "قالب نامعتبر است. مثال: 1h2m" };
    return { err: "", sec, ms: sec * 1000, human: human(sec), iso: iso8601(sec) };
  }, [parseStr]);

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <Segmented
          value={unit}
          onChange={setUnit}
          options={[
            { value: "s", label: "ثانیه" },
            { value: "ms", label: "میلی‌ثانیه" },
          ]}
        />
        <Field label="مقدار عددی">
          <TextInput
            mono
            dir="ltr"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="3723"
          />
        </Field>
      </div>
      {fmt?.err && <ErrorNote>{fmt.err}</ErrorNote>}
      {fmt && !fmt.err && (
        <Grid2>
          <Row label="خوانا" value={fmt.human} />
          <Row label="ISO 8601" value={fmt.iso} />
        </Grid2>
      )}

      <div className="rounded-2xl border border-border bg-surface/70 p-4 sm:p-5">
        <h3 className="mb-3 text-sm font-semibold text-fg">تجزیه‌ی متن مدت‌زمان</h3>
        <Field label="مدت‌زمان متنی" hint="مثال: 1h2m یا 90m یا 1d 5h">
          <TextInput
            mono
            dir="ltr"
            value={parseStr}
            onChange={(e) => setParseStr(e.target.value)}
            placeholder="1h2m"
          />
        </Field>
        {parsed?.err && (
          <div className="mt-3">
            <ErrorNote>{parsed.err}</ErrorNote>
          </div>
        )}
        {parsed && !parsed.err && (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Row label="ثانیه" value={String(parsed.sec)} />
            <Row label="میلی‌ثانیه" value={String(parsed.ms)} />
            <Row label="خوانا" value={parsed.human} />
            <Row label="ISO 8601" value={parsed.iso} />
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  const v = value ?? "";
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-3 py-2.5">
      <span className="w-28 shrink-0 text-xs text-saffron">{label}</span>
      <code dir="ltr" className="min-w-0 flex-1 truncate font-mono text-sm text-fg">
        {v}
      </code>
      <CopyButton value={v} />
    </div>
  );
}
