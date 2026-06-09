"use client";

import { useMemo, useState } from "react";
import { ErrorNote, Field, Output, Panel, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

type FieldSpec = { min: number; max: number; name: string };
const FIELDS: FieldSpec[] = [
  { min: 0, max: 59, name: "دقیقه" },
  { min: 0, max: 23, name: "ساعت" },
  { min: 1, max: 31, name: "روز ماه" },
  { min: 1, max: 12, name: "ماه" },
  { min: 0, max: 6, name: "روز هفته" },
];
const WEEKDAYS = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"];
const MONTHS = ["ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوئن", "ژوئیه", "اوت", "سپتامبر", "اکتبر", "نوامبر", "دسامبر"];

/** Expand one cron field into the sorted set of allowed values. */
function expandField(raw: string, spec: FieldSpec): number[] {
  const out = new Set<number>();
  for (const part of raw.split(",")) {
    const [rangePart, stepPart] = part.split("/");
    const step = stepPart ? parseInt(stepPart, 10) : 1;
    if (stepPart !== undefined && (!Number.isInteger(step) || step < 1))
      throw new Error("گام نامعتبر");
    let lo: number, hi: number;
    if (rangePart === "*" || rangePart === "") {
      lo = spec.min; hi = spec.max;
    } else if (rangePart.includes("-")) {
      const [a, b] = rangePart.split("-").map((n) => parseInt(n, 10));
      if (!Number.isInteger(a) || !Number.isInteger(b)) throw new Error("بازهٔ نامعتبر");
      lo = a; hi = b;
    } else {
      const v = parseInt(rangePart, 10);
      if (!Number.isInteger(v)) throw new Error("مقدار نامعتبر");
      lo = v; hi = v;
    }
    if (lo < spec.min || hi > spec.max || lo > hi)
      throw new Error(`مقدار خارج از بازهٔ ${spec.min}–${spec.max}`);
    for (let v = lo; v <= hi; v += step) out.add(v);
  }
  return [...out].sort((a, b) => a - b);
}

function describe(raw: string, spec: FieldSpec): string {
  if (raw === "*") return `هر ${spec.name}`;
  const vals = expandField(raw, spec);
  if (spec.name === "روز هفته") return "روزهای " + vals.map((v) => WEEKDAYS[v % 7]).join("، ");
  if (spec.name === "ماه") return "ماه‌های " + vals.map((v) => MONTHS[v - 1]).join("، ");
  if (vals.length > 8) return `${spec.name}: ${vals.length} مقدار`;
  return `${spec.name} ${vals.join("، ")}`;
}

function nextRuns(fields: number[][], count: number): Date[] {
  const [mins, hrs, doms, mons, dows] = fields;
  const ms = new Set(mins), hs = new Set(hrs), domS = new Set(doms),
    monS = new Set(mons), dowS = new Set(dows);
  const out: Date[] = [];
  const d = new Date();
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() + 1);
  // bounded scan: up to ~4 years of minutes
  for (let guard = 0; guard < 366 * 4 * 24 * 60 && out.length < count; guard++) {
    if (
      ms.has(d.getMinutes()) && hs.has(d.getHours()) &&
      monS.has(d.getMonth() + 1) && domS.has(d.getDate()) && dowS.has(d.getDay())
    ) {
      out.push(new Date(d));
    }
    d.setMinutes(d.getMinutes() + 1);
  }
  return out;
}

export default function CronParserTool() {
  const [expr, setExpr] = useState("");

  const result = useMemo(() => {
    const raw = toAsciiDigits(expr.trim());
    if (!raw) return null;
    const parts = raw.split(/\s+/);
    if (parts.length !== 5)
      return { error: "عبارت cron باید دقیقاً ۵ بخش داشته باشد (دقیقه ساعت روز ماه روزهفته)." };
    try {
      const fields = parts.map((p, i) => expandField(p, FIELDS[i]));
      const desc = parts.map((p, i) => describe(p, FIELDS[i])).join("؛ ");
      const runs = nextRuns(fields, 5);
      return { desc, runs };
    } catch (e) {
      return { error: e instanceof Error ? e.message : "عبارت نامعتبر است." };
    }
  }, [expr]);

  return (
    <div className="space-y-4">
      <Field label="عبارت Cron" hint="مثال: */5 9-17 * * 1-5">
        <TextInput
          mono
          dir="ltr"
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          placeholder="*/5 9-17 * * 1-5"
        />
      </Field>

      {result?.error && <ErrorNote>{result.error}</ErrorNote>}

      {result && !result.error && (
        <>
          <Panel title="توضیح">
            <p className="text-sm leading-relaxed text-fg" dir="auto">{result.desc}</p>
          </Panel>
          <Output
            label="۵ اجرای بعدی"
            value={
              result.runs && result.runs.length
                ? result.runs.map((d) => d.toLocaleString("fa-IR")).join("\n")
                : "اجرایی در بازهٔ آینده یافت نشد."
            }
            mono={false}
          />
        </>
      )}
    </div>
  );
}
