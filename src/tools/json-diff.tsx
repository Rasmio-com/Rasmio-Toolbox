"use client";

import { useMemo, useState } from "react";
import { ErrorNote, Field, Grid2, Stat, TextArea } from "@/components/tool/kit";

type Change = { kind: "added" | "removed" | "changed"; path: string; oldVal?: unknown; newVal?: unknown };

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function fmt(v: unknown): string {
  return JSON.stringify(v);
}

function diff(a: unknown, b: unknown, path: string, out: Change[]): void {
  if (Object.is(a, b)) return;
  // Recurse into matching containers; otherwise it's a leaf "changed".
  if (isObj(a) && isObj(b)) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) {
      const p = path ? `${path}.${k}` : k;
      if (!(k in a)) out.push({ kind: "added", path: p, newVal: b[k] });
      else if (!(k in b)) out.push({ kind: "removed", path: p, oldVal: a[k] });
      else diff(a[k], b[k], p, out);
    }
    return;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i++) {
      const p = `${path}[${i}]`;
      if (i >= a.length) out.push({ kind: "added", path: p, newVal: b[i] });
      else if (i >= b.length) out.push({ kind: "removed", path: p, oldVal: a[i] });
      else diff(a[i], b[i], p, out);
    }
    return;
  }
  if (JSON.stringify(a) !== JSON.stringify(b))
    out.push({ kind: "changed", path: path || "$", oldVal: a, newVal: b });
}

const STYLES: Record<Change["kind"], { label: string; cls: string; sign: string }> = {
  added: { label: "اضافه‌شده", cls: "border-success/30 bg-success/10 text-success", sign: "+" },
  removed: { label: "حذف‌شده", cls: "border-danger/30 bg-danger/10 text-danger", sign: "−" },
  changed: { label: "تغییر‌یافته", cls: "border-warning/30 bg-warning/10 text-warning", sign: "~" },
};

export default function JsonDiffTool() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");

  const { changes, err } = useMemo(() => {
    if (!left.trim() || !right.trim()) return { changes: [] as Change[], err: "" };
    let a: unknown, b: unknown;
    try {
      a = JSON.parse(left);
    } catch (e) {
      return { changes: [], err: `JSON اول نامعتبر: ${(e as Error).message}` };
    }
    try {
      b = JSON.parse(right);
    } catch (e) {
      return { changes: [], err: `JSON دوم نامعتبر: ${(e as Error).message}` };
    }
    const out: Change[] = [];
    diff(a, b, "", out);
    return { changes: out, err: "" };
  }, [left, right]);

  return (
    <div className="space-y-4">
      <Grid2>
        <Field label="JSON اول (قدیمی)">
          <TextArea
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            dir="ltr"
            placeholder='{"name":"Ali","age":30}'
            className="min-h-56"
          />
        </Field>
        <Field label="JSON دوم (جدید)">
          <TextArea
            value={right}
            onChange={(e) => setRight(e.target.value)}
            dir="ltr"
            placeholder='{"name":"Ali","age":31,"city":"Tehran"}'
            className="min-h-56"
          />
        </Field>
      </Grid2>
      {err && <ErrorNote>{err}</ErrorNote>}
      {!err && (left.trim() && right.trim()) && (
        <>
          <div className="grid grid-cols-3 gap-3">
            <Stat label="اضافه" value={changes.filter((c) => c.kind === "added").length} />
            <Stat label="حذف" value={changes.filter((c) => c.kind === "removed").length} />
            <Stat label="تغییر" value={changes.filter((c) => c.kind === "changed").length} />
          </div>
          {changes.length === 0 ? (
            <p className="rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
              دو ورودی یکسان‌اند.
            </p>
          ) : (
            <ul className="space-y-2">
              {changes.map((c, i) => {
                const s = STYLES[c.kind];
                return (
                  <li key={i} className={`rounded-lg border px-3 py-2 text-sm ${s.cls}`}>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{s.sign}</span>
                      <span className="font-mono text-fg" dir="ltr">
                        {c.path}
                      </span>
                      <span className="ms-auto text-xs">{s.label}</span>
                    </div>
                    {c.kind === "changed" && (
                      <div className="mt-1 font-mono text-xs text-muted" dir="ltr">
                        {fmt(c.oldVal)} → {fmt(c.newVal)}
                      </div>
                    )}
                    {c.kind === "added" && (
                      <div className="mt-1 font-mono text-xs text-muted" dir="ltr">
                        {fmt(c.newVal)}
                      </div>
                    )}
                    {c.kind === "removed" && (
                      <div className="mt-1 font-mono text-xs text-muted" dir="ltr">
                        {fmt(c.oldVal)}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
