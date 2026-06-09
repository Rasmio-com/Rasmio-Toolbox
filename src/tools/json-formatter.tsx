"use client";

import { useMemo, useState } from "react";
import {
  ErrorNote,
  Field,
  Grid2,
  Output,
  Select,
  TextArea,
  Toggle,
} from "@/components/tool/kit";

function sortDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortDeep);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, sortDeep(v)]),
    );
  }
  return value;
}

export default function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState("2");
  const [minify, setMinify] = useState(false);
  const [sortKeys, setSortKeys] = useState(false);

  const { out, err } = useMemo(() => {
    if (!input.trim()) return { out: "", err: "" };
    try {
      let obj = JSON.parse(input);
      if (sortKeys) obj = sortDeep(obj);
      const space = indent === "tab" ? "\t" : Number(indent);
      return { out: JSON.stringify(obj, null, minify ? undefined : space), err: "" };
    } catch (e) {
      return { out: "", err: `JSON نامعتبر: ${(e as Error).message}` };
    }
  }, [input, indent, minify, sortKeys]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-border bg-surface/40 px-4 py-3">
        <label className="flex items-center gap-2 text-sm text-muted">
          تورفتگی
          <Select
            value={indent}
            onChange={(e) => setIndent(e.target.value)}
            className="w-28"
            disabled={minify}
          >
            <option value="2">۲ فاصله</option>
            <option value="4">۴ فاصله</option>
            <option value="tab">Tab</option>
          </Select>
        </label>
        <Toggle checked={minify} onChange={setMinify} label="فشرده‌سازی" />
        <Toggle checked={sortKeys} onChange={setSortKeys} label="مرتب‌سازی کلیدها" />
      </div>
      <Grid2>
        <Field label="JSON ورودی">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"name":"رسمیو","tools":33}'
            dir="ltr"
            className="min-h-72"
          />
        </Field>
        <Output
          label="خروجی"
          value={out}
          className="min-h-72"
          download={{ filename: "formatted.json", mime: "application/json" }}
        />
      </Grid2>
      {err && <ErrorNote>{err}</ErrorNote>}
    </div>
  );
}
