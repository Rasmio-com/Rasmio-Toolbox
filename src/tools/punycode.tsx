"use client";

import { useMemo, useState } from "react";
import { ErrorNote, Field, Grid2, Output, Segmented, TextArea } from "@/components/tool/kit";

/* ── RFC 3492 Punycode (Bootstring) ────────────────────── */
const BASE = 36;
const TMIN = 1;
const TMAX = 26;
const SKEW = 38;
const DAMP = 700;
const INITIAL_BIAS = 72;
const INITIAL_N = 128;
const DELIM = "-";

function adapt(delta: number, numPoints: number, firstTime: boolean): number {
  delta = firstTime ? Math.floor(delta / DAMP) : delta >> 1;
  delta += Math.floor(delta / numPoints);
  let k = 0;
  while (delta > ((BASE - TMIN) * TMAX) >> 1) {
    delta = Math.floor(delta / (BASE - TMIN));
    k += BASE;
  }
  return k + Math.floor(((BASE - TMIN + 1) * delta) / (delta + SKEW));
}

function digitToBasic(d: number): number {
  return d + 22 + (d < 26 ? 75 : 0); // 0-25 -> a-z, 26-35 -> 0-9
}

function basicToDigit(cp: number): number {
  if (cp - 48 < 10) return cp - 22; // 0-9
  if (cp - 65 < 26) return cp - 65; // A-Z
  if (cp - 97 < 26) return cp - 97; // a-z
  return BASE;
}

function encodeLabel(input: string): string {
  const cps = Array.from(input, (c) => c.codePointAt(0)!);
  let n = INITIAL_N;
  let delta = 0;
  let bias = INITIAL_BIAS;
  const output: string[] = [];
  for (const cp of cps) if (cp < 0x80) output.push(String.fromCharCode(cp));
  let handled = output.length;
  const basicLength = handled;
  if (basicLength > 0) output.push(DELIM);

  while (handled < cps.length) {
    let m = Infinity;
    for (const cp of cps) if (cp >= n && cp < m) m = cp;
    delta += (m - n) * (handled + 1);
    n = m;
    for (const cp of cps) {
      if (cp < n) delta++;
      if (cp === n) {
        let q = delta;
        for (let k = BASE; ; k += BASE) {
          const t = k <= bias ? TMIN : k >= bias + TMAX ? TMAX : k - bias;
          if (q < t) break;
          output.push(String.fromCharCode(digitToBasic(t + ((q - t) % (BASE - t)))));
          q = Math.floor((q - t) / (BASE - t));
        }
        output.push(String.fromCharCode(digitToBasic(q)));
        bias = adapt(delta, handled + 1, handled === basicLength);
        delta = 0;
        handled++;
      }
    }
    delta++;
    n++;
  }
  return output.join("");
}

function decodeLabel(input: string): string {
  let n = INITIAL_N;
  let i = 0;
  let bias = INITIAL_BIAS;
  const output: number[] = [];
  const lastDelim = input.lastIndexOf(DELIM);
  const basic = lastDelim < 0 ? "" : input.slice(0, lastDelim);
  for (const ch of basic) {
    if (ch.charCodeAt(0) >= 0x80) throw new Error("not basic");
    output.push(ch.charCodeAt(0));
  }
  let idx = lastDelim < 0 ? 0 : lastDelim + 1;
  while (idx < input.length) {
    const oldi = i;
    let w = 1;
    for (let k = BASE; ; k += BASE) {
      if (idx >= input.length) throw new Error("bad input");
      const digit = basicToDigit(input.charCodeAt(idx++));
      if (digit >= BASE) throw new Error("bad digit");
      i += digit * w;
      const t = k <= bias ? TMIN : k >= bias + TMAX ? TMAX : k - bias;
      if (digit < t) break;
      w *= BASE - t;
    }
    const out = output.length + 1;
    bias = adapt(i - oldi, out, oldi === 0);
    n += Math.floor(i / out);
    i %= out;
    output.splice(i++, 0, n);
  }
  return String.fromCodePoint(...output);
}

const hasNonAscii = (s: string) => /[^\x00-\x7f]/.test(s);

function toPunycode(input: string): string {
  return input
    .split(".")
    .map((label) => (hasNonAscii(label) ? "xn--" + encodeLabel(label) : label))
    .join(".");
}

function fromPunycode(input: string): string {
  return input
    .split(".")
    .map((label) =>
      /^xn--/i.test(label) ? decodeLabel(label.slice(4)) : label,
    )
    .join(".");
}

export default function PunycodeTool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");

  const { out, err } = useMemo(() => {
    const t = input.trim();
    if (!t) return { out: "", err: "" };
    try {
      return { out: mode === "encode" ? toPunycode(t) : fromPunycode(t), err: "" };
    } catch {
      return { out: "", err: "ورودی Punycode نامعتبر است." };
    }
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "encode", label: "دامنه ← Punycode" },
          { value: "decode", label: "Punycode ← دامنه" },
        ]}
      />
      <Grid2>
        <Field label="ورودی">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "مثال.ایران" : "xn--mgbx4cd0ab.xn--mgba3a4f16a"}
            dir="auto"
            className="min-h-28"
          />
        </Field>
        <Output label="خروجی" value={out} className="min-h-28" />
      </Grid2>
      {err && <ErrorNote>{err}</ErrorNote>}
    </div>
  );
}
