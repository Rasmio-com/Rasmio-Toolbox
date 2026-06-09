"use client";

import { useMemo, useState } from "react";
import { ErrorNote, Field, Grid2, Output, Segmented, TextArea } from "@/components/tool/kit";

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

// Flatten nested objects/arrays to dot/bracket keys: a.b[0].c
function flatten(value: unknown, prefix: string, out: Record<string, unknown>): void {
  if (isObj(value)) {
    const entries = Object.entries(value);
    if (entries.length === 0 && prefix) out[prefix] = {};
    for (const [k, v] of entries) flatten(v, prefix ? `${prefix}.${k}` : k, out);
  } else if (Array.isArray(value)) {
    if (value.length === 0 && prefix) out[prefix] = [];
    value.forEach((v, i) => flatten(v, `${prefix}[${i}]`, out));
  } else {
    out[prefix] = value;
  }
}

// Parse "a.b[0].c" into segments: ["a","b",0,"c"]
function parseKey(key: string): (string | number)[] {
  const segs: (string | number)[] = [];
  const re = /[^.[\]]+|\[(\d+)\]/g;
  let m: RegExpExecArray | null;
  for (const part of key.split(".")) {
    re.lastIndex = 0;
    while ((m = re.exec(part))) {
      segs.push(m[1] !== undefined ? Number(m[1]) : m[0]);
    }
  }
  return segs;
}

function unflatten(flat: Record<string, unknown>): unknown {
  const root: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(flat)) {
    const segs = parseKey(key);
    let cur: Record<string, unknown> | unknown[] = root;
    segs.forEach((seg, i) => {
      const last = i === segs.length - 1;
      if (last) {
        (cur as Record<string | number, unknown>)[seg] = val;
      } else {
        const nextIsIndex = typeof segs[i + 1] === "number";
        const existing = (cur as Record<string | number, unknown>)[seg];
        if (existing === undefined) {
          (cur as Record<string | number, unknown>)[seg] = nextIsIndex ? [] : {};
        }
        cur = (cur as Record<string | number, unknown>)[seg] as Record<string, unknown> | unknown[];
      }
    });
  }
  return root;
}

export default function JsonFlattenTool() {
  const [mode, setMode] = useState<"flatten" | "unflatten">("flatten");
  const [input, setInput] = useState("");

  const { out, err } = useMemo(() => {
    if (!input.trim()) return { out: "", err: "" };
    try {
      const data = JSON.parse(input);
      if (mode === "flatten") {
        const flat: Record<string, unknown> = {};
        flatten(data, "", flat);
        return { out: JSON.stringify(flat, null, 2), err: "" };
      }
      if (!isObj(data)) throw new Error("ورودی باید یک شیء از کلیدهای نقطه‌ای باشد");
      return { out: JSON.stringify(unflatten(data), null, 2), err: "" };
    } catch (e) {
      return { out: "", err: `ورودی نامعتبر: ${(e as Error).message}` };
    }
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "flatten", label: "تخت‌سازی" },
          { value: "unflatten", label: "بازگشت به تو‌در‌تو" },
        ]}
      />
      <Grid2>
        <Field label="JSON ورودی">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            dir="ltr"
            placeholder={
              mode === "flatten" ? '{"a":{"b":[1,2]}}' : '{"a.b[0]":1,"a.b[1]":2}'
            }
            className="min-h-72"
          />
        </Field>
        <Output label="خروجی" value={out} className="min-h-72" download={{ filename: "out.json", mime: "application/json" }} />
      </Grid2>
      {err && <ErrorNote>{err}</ErrorNote>}
    </div>
  );
}
