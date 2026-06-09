"use client";

import { useMemo, useState } from "react";
import { CopyButton, Field, TextArea } from "@/components/tool/kit";

function words(s: string): string[] {
  return s
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_\-./]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();

function convert(s: string) {
  const w = words(s);
  const lower = w.map((x) => x.toLowerCase());
  return [
    { label: "camelCase", value: lower.map((x, i) => (i ? cap(x) : x)).join("") },
    { label: "PascalCase", value: w.map(cap).join("") },
    { label: "snake_case", value: lower.join("_") },
    { label: "kebab-case", value: lower.join("-") },
    { label: "CONSTANT_CASE", value: lower.join("_").toUpperCase() },
    { label: "Title Case", value: w.map(cap).join(" ") },
    {
      label: "Sentence case",
      value: lower.length ? cap(lower[0]) + (lower.length > 1 ? " " + lower.slice(1).join(" ") : "") : "",
    },
    { label: "lowercase", value: s.toLowerCase() },
    { label: "UPPERCASE", value: s.toUpperCase() },
    {
      label: "aLtErNaTiNg",
      value: Array.from(s)
        .map((c, i) => (i % 2 ? c.toUpperCase() : c.toLowerCase()))
        .join(""),
    },
  ];
}

export default function CaseConverterTool() {
  const [text, setText] = useState("");
  const rows = useMemo(() => convert(text), [text]);

  return (
    <div className="space-y-4">
      <Field label="متن ورودی">
        <TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="hello world example"
          className="min-h-24"
        />
      </Field>
      <div className="space-y-2">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-3 py-2.5"
          >
            <span className="w-32 shrink-0 font-mono text-xs text-saffron">
              {r.label}
            </span>
            <code dir="ltr" className="min-w-0 flex-1 truncate text-sm text-fg">
              {r.value || "—"}
            </code>
            <CopyButton value={r.value} />
          </div>
        ))}
      </div>
    </div>
  );
}
