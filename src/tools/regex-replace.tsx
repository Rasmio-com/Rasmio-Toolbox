"use client";

import { useMemo, useState } from "react";
import { ErrorNote, Field, Grid2, Output, TextArea, TextInput } from "@/components/tool/kit";
import { cn } from "@/lib/utils";

const FLAGS: { f: string; label: string }[] = [
  { f: "g", label: "global" },
  { f: "i", label: "ignore case" },
  { f: "m", label: "multiline" },
  { f: "s", label: "dotAll" },
  { f: "u", label: "unicode" },
];

export default function RegexReplaceTool() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [replacement, setReplacement] = useState("");
  const [test, setTest] = useState("");

  const toggleFlag = (f: string) =>
    setFlags((cur) => (cur.includes(f) ? cur.replace(f, "") : cur + f));

  const { out, err, count } = useMemo(() => {
    if (!pattern) return { out: test, err: "", count: 0 };
    let re: RegExp;
    try {
      re = new RegExp(pattern, flags);
    } catch (e) {
      return { out: "", err: (e as Error).message, count: 0 };
    }
    const countRe = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
    const count = (test.match(countRe) ?? []).length;
    try {
      return { out: test.replace(re, replacement), err: "", count };
    } catch (e) {
      return { out: "", err: (e as Error).message, count: 0 };
    }
  }, [pattern, flags, replacement, test]);

  return (
    <div className="space-y-4">
      <Field label="الگوی Regex">
        <div className="flex items-center gap-2">
          <span className="font-mono text-lg text-faint">/</span>
          <TextInput
            mono
            dir="ltr"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="(\\w+)@(\\w+)"
          />
          <span className="font-mono text-lg text-faint">/{flags}</span>
        </div>
      </Field>

      <div className="flex flex-wrap gap-2">
        {FLAGS.map(({ f, label }) => (
          <button
            key={f}
            onClick={() => toggleFlag(f)}
            title={label}
            className={cn(
              "rounded-lg border px-2.5 py-1 font-mono text-sm transition-colors",
              flags.includes(f)
                ? "border-turquoise-dim bg-turquoise/15 text-turquoise"
                : "border-border bg-surface-2 text-muted hover:text-fg",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <Field label="جایگزین با" hint="از $1، $2 و $& پشتیبانی می‌شود">
        <TextInput
          mono
          dir="ltr"
          value={replacement}
          onChange={(e) => setReplacement(e.target.value)}
          placeholder="$1 [at] $2"
        />
      </Field>

      {err && <ErrorNote>{err}</ErrorNote>}

      {pattern && !err && (
        <p className="text-sm text-muted">{count.toLocaleString("fa-IR")} تطبیق پیدا شد</p>
      )}

      <Grid2>
        <Field label="متن آزمایشی">
          <TextArea
            value={test}
            onChange={(e) => setTest(e.target.value)}
            placeholder="متنی که می‌خواهید جایگزینی روی آن انجام شود…"
            className="min-h-52"
          />
        </Field>
        <Output label="نتیجه" value={out} className="min-h-52" />
      </Grid2>
    </div>
  );
}
