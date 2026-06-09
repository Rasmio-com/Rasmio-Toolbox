"use client";

import { useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import { ErrorNote, Field, Grid2, Stat, TextArea, TextInput } from "@/components/tool/kit";

/** Convert a glob pattern to a RegExp. Supports *, **, ?, [abc], {a,b}. */
function globToRegExp(glob: string): RegExp {
  let re = "";
  let i = 0;
  while (i < glob.length) {
    const c = glob[i];
    if (c === "*") {
      if (glob[i + 1] === "*") {
        // ** matches across path separators
        re += ".*";
        i += 2;
        if (glob[i] === "/") i++; // consume trailing slash of **/
        continue;
      }
      re += "[^/]*";
      i++;
    } else if (c === "?") {
      re += "[^/]";
      i++;
    } else if (c === "[") {
      let j = i + 1;
      let cls = "[";
      if (glob[j] === "!" || glob[j] === "^") { cls += "^"; j++; }
      while (j < glob.length && glob[j] !== "]") {
        const ch = glob[j];
        cls += /[\\^$.*+?()[\]{}|]/.test(ch) && ch !== "-" ? "\\" + ch : ch;
        j++;
      }
      if (glob[j] !== "]") throw new Error("کلاس کاراکتری بسته نشده است");
      re += cls + "]";
      i = j + 1;
    } else if (c === "{") {
      const end = glob.indexOf("}", i);
      if (end === -1) throw new Error("آکولاد بسته نشده است");
      const opts = glob.slice(i + 1, end).split(",");
      re += "(?:" + opts.map((o) => o.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")";
      i = end + 1;
    } else {
      re += /[\\^$.+?()|[\]{}]/.test(c) ? "\\" + c : c;
      i++;
    }
  }
  return new RegExp("^" + re + "$");
}

export default function GlobTesterTool() {
  const [pattern, setPattern] = useState("");
  const [paths, setPaths] = useState("");

  const { rows, err } = useMemo(() => {
    if (!pattern.trim()) return { rows: [] as { path: string; match: boolean }[], err: "" };
    let re: RegExp;
    try {
      re = globToRegExp(pattern.trim());
    } catch (e) {
      return { rows: [], err: e instanceof Error ? e.message : "الگوی نامعتبر" };
    }
    const rows = paths
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean)
      .map((path) => ({ path, match: re.test(path) }));
    return { rows, err: "" };
  }, [pattern, paths]);

  const matched = rows.filter((r) => r.match).length;

  return (
    <div className="space-y-4">
      <Field label="الگوی Glob" hint="* ** ? [abc] {a,b}">
        <TextInput
          mono
          dir="ltr"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="src/**/*.{ts,tsx}"
        />
      </Field>
      <Grid2>
        <Field label="مسیرها (هر خط یک مسیر)">
          <TextArea
            value={paths}
            onChange={(e) => setPaths(e.target.value)}
            placeholder={"src/index.ts\nsrc/lib/util.tsx\nREADME.md"}
          />
        </Field>
        <Field label="نتیجه">
          <div className="space-y-1.5" dir="ltr">
            {rows.map((r, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg border border-border bg-bg-soft px-3 py-2 text-sm"
              >
                {r.match ? (
                  <Check className="size-4 shrink-0 text-success" />
                ) : (
                  <X className="size-4 shrink-0 text-faint" />
                )}
                <code className={r.match ? "text-fg" : "text-muted"}>{r.path}</code>
              </div>
            ))}
            {rows.length === 0 && !err && (
              <p className="py-6 text-center text-sm text-muted" dir="rtl">
                الگو و مسیرها را وارد کنید.
              </p>
            )}
          </div>
        </Field>
      </Grid2>
      {err && <ErrorNote>{err}</ErrorNote>}
      {rows.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <Stat label="مطابق" value={matched} />
          <Stat label="کل مسیرها" value={rows.length} />
        </div>
      )}
    </div>
  );
}
