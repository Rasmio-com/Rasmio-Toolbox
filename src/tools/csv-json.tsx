"use client";

import { useMemo, useState } from "react";
import {
  ErrorNote,
  Field,
  Grid2,
  Output,
  Segmented,
  Select,
  TextArea,
} from "@/components/tool/kit";

function parseCSV(text: string, delim: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cur += '"';
          i++;
        } else inQ = false;
      } else cur += c;
    } else if (c === '"') inQ = true;
    else if (c === delim) {
      row.push(cur);
      cur = "";
    } else if (c === "\n") {
      row.push(cur);
      rows.push(row);
      row = [];
      cur = "";
    } else if (c !== "\r") cur += c;
  }
  if (cur !== "" || row.length) {
    row.push(cur);
    rows.push(row);
  }
  return rows.filter((r) => r.length > 1 || r[0] !== "");
}

function toCSV(rows: unknown[], delim: string): string {
  if (!Array.isArray(rows) || rows.length === 0) return "";
  const headers = Array.from(
    new Set(rows.flatMap((r) => Object.keys(r as object))),
  );
  const esc = (v: unknown) => {
    const s = v == null ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
    const needsQuote =
      s.includes('"') || s.includes("\n") || s.includes("\r") || s.includes(delim);
    return needsQuote ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(delim)];
  for (const r of rows) {
    lines.push(headers.map((h) => esc((r as Record<string, unknown>)[h])).join(delim));
  }
  return lines.join("\n");
}

const DELIMS: Record<string, string> = { ",": "،(کاما)", ";": "؛(سمی‌کالن)", "\t": "Tab" };

export default function CsvJsonTool() {
  const [mode, setMode] = useState<"c2j" | "j2c">("c2j");
  const [input, setInput] = useState("");
  const [delim, setDelim] = useState(",");

  const { out, err } = useMemo(() => {
    if (!input.trim()) return { out: "", err: "" };
    try {
      if (mode === "c2j") {
        const rows = parseCSV(input, delim);
        if (!rows.length) return { out: "[]", err: "" };
        const [head, ...body] = rows;
        const objs = body.map((r) =>
          Object.fromEntries(head.map((h, i) => [h, r[i] ?? ""])),
        );
        return { out: JSON.stringify(objs, null, 2), err: "" };
      }
      const data = JSON.parse(input);
      const arr = Array.isArray(data) ? data : [data];
      return { out: toCSV(arr, delim), err: "" };
    } catch (e) {
      return { out: "", err: `ورودی نامعتبر: ${(e as Error).message}` };
    }
  }, [input, mode, delim]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "c2j", label: "CSV ← JSON" },
            { value: "j2c", label: "JSON ← CSV" },
          ]}
        />
        <label className="flex items-center gap-2 text-sm text-muted">
          جداکننده
          <Select value={delim} onChange={(e) => setDelim(e.target.value)} className="w-36">
            {Object.entries(DELIMS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        </label>
      </div>
      <Grid2>
        <Field label={mode === "c2j" ? "CSV ورودی" : "JSON ورودی"}>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            dir="ltr"
            placeholder={
              mode === "c2j" ? "name,age\nAli,30\nSara,25" : '[{"name":"Ali","age":30}]'
            }
            className="min-h-72"
          />
        </Field>
        <Output
          label="خروجی"
          value={out}
          className="min-h-72"
          download={{ filename: mode === "c2j" ? "out.json" : "out.csv" }}
        />
      </Grid2>
      {err && <ErrorNote>{err}</ErrorNote>}
    </div>
  );
}
