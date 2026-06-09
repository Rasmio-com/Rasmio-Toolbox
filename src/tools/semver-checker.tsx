"use client";

import { useMemo, useState } from "react";
import { Field, Grid2, Panel, Segmented, Stat, TextInput } from "@/components/tool/kit";

type SemVer = { major: number; minor: number; patch: number; pre: string[] };

const RE = /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/;

function parse(v: string): SemVer | null {
  const m = RE.exec(v.trim());
  if (!m) return null;
  return {
    major: +m[1], minor: +m[2], patch: +m[3],
    pre: m[4] ? m[4].split(".") : [],
  };
}

function cmpPre(a: string[], b: string[]): number {
  if (!a.length && !b.length) return 0;
  if (!a.length) return 1; // no prerelease > has prerelease
  if (!b.length) return -1;
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (a[i] === undefined) return -1;
    if (b[i] === undefined) return 1;
    const an = /^\d+$/.test(a[i]), bn = /^\d+$/.test(b[i]);
    if (an && bn) {
      const d = +a[i] - +b[i];
      if (d) return d < 0 ? -1 : 1;
    } else if (an) return -1;
    else if (bn) return 1;
    else if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  }
  return 0;
}

function compare(a: SemVer, b: SemVer): number {
  for (const k of ["major", "minor", "patch"] as const) {
    if (a[k] !== b[k]) return a[k] < b[k] ? -1 : 1;
  }
  return cmpPre(a.pre, b.pre);
}

/** Test a version against a single comparator string (^, ~, >=, etc. or x-range). */
function satisfiesOne(v: SemVer, range: string): boolean {
  const r = range.trim();
  if (!r || r === "*" || r === "x") return true;

  const op = /^(>=|<=|>|<|=)/.exec(r);
  if (op) {
    const target = parse(r.slice(op[0].length));
    if (!target) return false;
    const c = compare(v, target);
    switch (op[1]) {
      case ">": return c > 0;
      case "<": return c < 0;
      case ">=": return c >= 0;
      case "<=": return c <= 0;
      default: return c === 0;
    }
  }

  if (r[0] === "^" || r[0] === "~") {
    const t = parse(r.slice(1));
    if (!t) return false;
    if (compare(v, t) < 0) return false;
    if (r[0] === "^") {
      // allow changes that do not modify the left-most non-zero
      if (t.major > 0) return v.major === t.major;
      if (t.minor > 0) return v.major === 0 && v.minor === t.minor;
      return v.major === 0 && v.minor === 0 && v.patch === t.patch;
    }
    // ~ : same major.minor (if minor specified)
    return v.major === t.major && v.minor === t.minor;
  }

  // x-range like 1.2.x / 1.x / 1
  const parts = r.split(".");
  const nums = [v.major, v.minor, v.patch];
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (p === "x" || p === "X" || p === "*") continue;
    if (+p !== nums[i]) return false;
  }
  return true;
}

/** Support space-separated AND comparators and || OR sets. */
function satisfies(v: SemVer, range: string): boolean {
  return range.split("||").some((set) =>
    set.trim().split(/\s+/).filter(Boolean).every((c) => satisfiesOne(v, c)),
  );
}

export default function SemverCheckerTool() {
  const [mode, setMode] = useState<"validate" | "compare" | "range">("validate");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [range, setRange] = useState("");

  const pa = useMemo(() => parse(a), [a]);
  const pb = useMemo(() => parse(b), [b]);

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "validate", label: "اعتبارسنجی" },
          { value: "compare", label: "مقایسه" },
          { value: "range", label: "تطبیق بازه" },
        ]}
      />

      {mode === "validate" && (
        <>
          <Field label="نسخه">
            <TextInput mono dir="ltr" value={a} onChange={(e) => setA(e.target.value)} placeholder="1.4.2-beta.1" />
          </Field>
          {a.trim() && (
            <Panel title={pa ? "نسخهٔ معتبر ✓" : "نسخهٔ نامعتبر ✗"}>
              {pa ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Stat label="Major" value={pa.major} />
                  <Stat label="Minor" value={pa.minor} />
                  <Stat label="Patch" value={pa.patch} />
                  <Stat label="Prerelease" value={pa.pre.join(".") || "—"} />
                </div>
              ) : (
                <p className="text-sm text-danger">قالب باید X.Y.Z باشد (مثلاً 2.0.1).</p>
              )}
            </Panel>
          )}
        </>
      )}

      {mode === "compare" && (
        <>
          <Grid2>
            <Field label="نسخهٔ A">
              <TextInput mono dir="ltr" value={a} onChange={(e) => setA(e.target.value)} placeholder="1.2.0" />
            </Field>
            <Field label="نسخهٔ B">
              <TextInput mono dir="ltr" value={b} onChange={(e) => setB(e.target.value)} placeholder="1.10.0" />
            </Field>
          </Grid2>
          {pa && pb && (
            <Panel title="نتیجهٔ مقایسه">
              {(() => {
                const c = compare(pa, pb);
                const sym = c === 0 ? "A = B" : c < 0 ? "A < B" : "A > B";
                return (
                  <div className="grid grid-cols-2 gap-3">
                    <Stat label="مقدار مقایسه" value={c} />
                    <Stat label="رابطه" value={sym} />
                  </div>
                );
              })()}
            </Panel>
          )}
          {(a.trim() && !pa) || (b.trim() && !pb) ? (
            <p className="text-sm text-danger">یکی از نسخه‌ها نامعتبر است.</p>
          ) : null}
        </>
      )}

      {mode === "range" && (
        <>
          <Grid2>
            <Field label="نسخه">
              <TextInput mono dir="ltr" value={a} onChange={(e) => setA(e.target.value)} placeholder="1.5.3" />
            </Field>
            <Field label="بازه (Range)" hint="^ ~ >= <= > < x ||">
              <TextInput mono dir="ltr" value={range} onChange={(e) => setRange(e.target.value)} placeholder="^1.0.0" />
            </Field>
          </Grid2>
          {pa && range.trim() && (
            <Panel title="نتیجهٔ تطبیق">
              <Stat
                label="آیا نسخه با بازه سازگار است؟"
                value={satisfies(pa, range) ? "بله ✓" : "خیر ✗"}
              />
            </Panel>
          )}
          {a.trim() && !pa && <p className="text-sm text-danger">نسخهٔ نامعتبر است.</p>}
        </>
      )}
    </div>
  );
}
